"use client";

import { useState, useEffect } from "react";
import { CheckCircle2, XCircle, Eye, Filter, LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import ApprovalModal from "@/components/approval-modal";

interface DepositRequest {
  id: string;
  userId: string;
  userName: string;
  email: string;
  plan: string;
  amount: number;
  paymentProof: string;
  status: "pending" | "approved" | "rejected";
  submittedDate: string;
}

export default function AdminDashboard() {
  const [requests, setRequests] = useState<DepositRequest[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<DepositRequest | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState<
    "all" | "pending" | "approved" | "rejected"
  >("pending");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [adminUser, setAdminUser] = useState<{
    fullName: string;
    email: string;
  } | null>(null);

  // Derived counts
  const approvedCount = requests.filter((r) => r.status === "approved").length;
  const rejectedCount = requests.filter((r) => r.status === "rejected").length;

  // Filtered list for the table
  const filteredRequests =
    filterStatus === "all"
      ? requests
      : requests.filter((r) => r.status === filterStatus);

  // Fetch ALL deposit requests from backend
  const fetchRequests = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        "https://top-mart-api.onrender.com/api/approval/pending-users",
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch deposit requests");
      }

      const json = await response.json().catch(() => null);
      const raw = Array.isArray(json) ? json : json?.data ?? json?.proofs ?? [];

      // normalize PaymentProof -> DepositRequest
      const mapped = (Array.isArray(raw) ? raw : []).map((p: any) => {
        const user = p.userId ?? p.user ?? {};
        const created = p.createdAt ?? p.submittedAt ?? p.date ?? p.created;
        return {
          id: String(p._id ?? p.id ?? ""),
          userId: String(user._id ?? user.id ?? p.userId ?? ""),
          userName:
            user?.fullName ??
            user?.name ??
            (`${user?.firstName ?? ""} ${user?.lastName ?? ""}`.trim() ||
              "Unknown"),
          email: user?.email ?? p.email ?? "",
          plan: p.plan ?? p.investmentPlan ?? "Unknown",
          amount: Number(p.amount ?? p.investmentAmount ?? p.proofAmount ?? 0),
          paymentProof: p.paymentProof ?? p.proofUrl ?? p.receiptUrl ?? "",
          status: (p.status ?? "pending") as
            | "pending"
            | "approved"
            | "rejected",
          submittedDate: created
            ? new Date(created).toLocaleString()
            : p.submittedDate ?? "",
        } as DepositRequest;
      });

      setRequests(mapped);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Verify admin and fetch data
  const verifyAuthAndFetch = async () => {
    try {
      const authResponse = await fetch(
        "https://top-mart-api.onrender.com/api/admin/verify",
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        }
      );

      if (!authResponse.ok) {
        window.location.href = "/admin-auth";
        return;
      }

      const authData = await authResponse.json().catch(() => ({}));
      // normalize shape: support { user }, { data: { user } } or direct user object
      const rawUser = authData?.user ?? authData?.data?.user ?? authData?.admin ?? authData;
      const fullName =
        (rawUser?.fullName ??
        rawUser?.name ??
        `${rawUser?.firstName ?? ""} ${rawUser?.lastName ?? ""}`.trim()) ||
        "";
      const email = rawUser?.email ?? rawUser?.emailAddress ?? "";
      setAdminUser({ fullName, email });
      // optional: console.log(authData, rawUser);

      await fetchRequests();
    } catch (err) {
      console.error("Auth verification failed:", err);
      window.location.href = "/admin-auth";
    }
  };

  // Approve a deposit (use depositId from Deposit._id)
  const handleApprove = async (depositId: string) => {
    try {
      const response = await fetch(
        `https://top-mart-api.onrender.com/api/approval/${depositId}/approve`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        }
      );

      const bodyText = await response.text().catch(() => "");
      if (!response.ok) {
        console.error("Approve failed:", response.status, bodyText);
        throw new Error(`Approve failed: ${response.status}`);
      }

      // parse response to get updated data
      const data = JSON.parse(bodyText);
      console.log("Approve response:", data);

       // mark the specific deposit as approved in UI
       setRequests((prev) =>
         prev.map((r) => (r.id === depositId ? { ...r, status: "approved" } : r))
       );

       // show approved items and refresh to ensure totals are accurate
       setFilterStatus("approved");
       setSelectedRequest(null);
       setIsModalOpen(false);

       // refresh from server to get authoritative data (optional but recommended)
       await fetchRequests();
    } catch (err) {
      console.error("Approve error:", err);
    }
  };

  // Reject a deposit (use depositId and send reason)
  const handleReject = async (depositId: string, reason: string) => {
    try {
      const response = await fetch(
        `https://top-mart-api.onrender.com/api/deposit/${depositId}/reject`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ reason }),
        }
      );

      const bodyText = await response.text().catch(() => "");
      if (!response.ok) {
        console.error("Reject failed:", response.status, bodyText);
        throw new Error(`Reject failed: ${response.status}`);
      }

      // parse response
      const data = JSON.parse(bodyText);
      console.log("Reject response:", data);

       setRequests((prev) =>
         prev.map((r) => (r.id === depositId ? { ...r, status: "rejected" } : r))
       );

       setIsModalOpen(false);
       await fetchRequests();
    } catch (err) {
      console.error("Reject error:", err);
    }
  };
  // Handle logout
  const handleLogout = async () => {
    try {
      const response = await fetch(
        "https://top-mart-api.onrender.com/api/admin/logout",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        }
      );

      if (!response.ok) throw new Error("Logout failed");

      window.location.href = "/admin-auth";
    } catch (err) {
      console.error("Logout error:", err);
    }
  };
  useEffect(() => {
    verifyAuthAndFetch();
  }, []);
  return (
    <div className="p-8">
      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-6">
          <p className="text-red-400">Error: {error}</p>
          <Button
            onClick={fetchRequests}
            className="mt-2 bg-red-500 hover:bg-red-600 text-white"
          >
            Retry
          </Button>
        </div>
      )}

      {/* Main Content */}
      {!loading && !error && (
        <>
          {/* Header with User Info */}
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-pink-500 mb-2">
                Admin Dashboard
              </h1>
              <p className="text-slate-400">
                Manage and approve user deposits applications
              </p>
            </div>
            {adminUser && (
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-pink-500 font-medium">
                    {adminUser.fullName}
                  </p>
                  <p className="text-slate-400 text-sm">{adminUser.email}</p>
                </div>
                <Button
                  onClick={handleLogout}
                  variant="ghost"
                  className="text-slate-400 hover:text-white hover:bg-slate-800"
                >
                  <LogOut className="w-5 h-5" />
                </Button>
              </div>
            )}
          </div>

          {/* Header */}
          <div className="mb-8 hidden">
            <h1 className="text-4xl font-bold text-white mb-2">
              Admin Dashboard
            </h1>
            <p className="text-slate-400">
              Manage and approve user investment plan applications
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <StatCard
              title="Pending Approvals"
              value={requests.filter((r) => r.status === "pending").length}
              color="bg-amber-500/10 text-amber-400"
              icon="⏳"
            />
            <StatCard
              title="Approved Plans"
              value={approvedCount}
              color="bg-emerald-500/10 text-emerald-400"
              icon="✓"
            />
            <StatCard
              title="Rejected Plans"
              value={rejectedCount}
              color="bg-red-500/10 text-red-400"
              icon="✕"
            />
            <StatCard
              title="Total Invested"
              value={`₦${requests
                .reduce(
                  (sum, r) => (r.status === "approved" ? sum + r.amount : sum),
                  0
                )
                .toLocaleString()}`}
              color="bg-blue-500/10 text-blue-400"
              icon="💰"
            />
          </div>

          {/* Filter Controls */}
          <div className="mb-6 flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-slate-400" />
              <span className="text-slate-400 text-sm">Filter:</span>
            </div>
            <div className="flex gap-2">
              {(["pending", "approved", "rejected", "all"] as const).map(
                (status) => (
                  <button
                    key={status}
                    onClick={() => setFilterStatus(status)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                      filterStatus === status
                        ? "bg-pink-500 text-white"
                        : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                    }`}
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </button>
                )
              )}
            </div>
          </div>

          {/* Main Table */}
          <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-800 border-b border-slate-700">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">
                      User Name
                    </th>

                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">
                      Amount
                    </th>

                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">
                      Submitted
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-800">
                  {filteredRequests.length === 0 ? (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-6 py-12 text-center text-slate-400"
                      >
                        No requests found with the selected filter.
                      </td>
                    </tr>
                  ) : (
                    filteredRequests.map((r, idx) => (
                      <tr
                        key={r.id || r.userId || idx}
                        className="hover:bg-slate-800/50 transition"
                      >
                        <td className="px-6 py-4">
                          <div>
                            <p className="text-white font-medium">
                              {r.userName}
                            </p>
                            <p className="text-slate-400 text-sm">{r.email}</p>
                          </div>
                        </td>

                        <td className="px-6 py-4 text-white font-semibold">
                          ₦{r.amount.toLocaleString()}
                        </td>

                        <td className="px-6 py-4 text-slate-400 text-sm">
                          {r.submittedDate}
                        </td>
                        <td className="px-6 py-4">
                          <StatusBadge status={r.status} />
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            {r.status === "pending" && (
                              <Button
                                size="sm"
                                onClick={() => {
                                  setSelectedRequest(r);
                                  setIsModalOpen(true);
                                }}
                                className="bg-pink-500 hover:bg-pink-600 text-white h-8 px-3"
                              >
                                Review
                              </Button>
                            )}
                            {r.status !== "pending" && (
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => {
                                  setSelectedRequest(r);
                                  setIsModalOpen(true);
                                }}
                                className="text-slate-400 h-8"
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Approval Modal */}
          {selectedRequest && (
            <ApprovalModal
              isOpen={isModalOpen}
              request={selectedRequest}
              onApprove={() => handleApprove(selectedRequest.id)}
              onReject={(reason) => handleReject(selectedRequest.id, reason)}
              onClose={() => setIsModalOpen(false)}
            />
          )}
        </>
      )}
    </div>
  );
}

function StatCard({
  title,
  value,
  color,
  icon,
}: {
  title: string;
  value: string | number;
  color: string;
  icon: string;
}) {
  return (
    <div className={`${color} rounded-xl p-6 border border-current/20`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium opacity-75 mb-2">{title}</p>
          <p className="text-3xl font-bold">{value}</p>
        </div>
        <span className="text-2xl">{icon}</span>
      </div>
    </div>
  );
}

function StatusBadge({
  status,
}: {
  status: "pending" | "approved" | "rejected";
}) {
  const statusConfig = {
    pending: {
      bg: "bg-amber-500/10",
      text: "text-amber-400",
      label: "Pending",
    },
    approved: {
      bg: "bg-emerald-500/10",
      text: "text-emerald-400",
      label: "Approved",
    },
    rejected: { bg: "bg-red-500/10", text: "text-red-400", label: "Rejected" },
  };

  const config = statusConfig[status];

  return (
    <span
      className={`${config.bg} ${config.text} px-3 py-1 rounded-full text-sm font-medium inline-flex items-center gap-2`}
    >
      {status === "approved" && <CheckCircle2 className="w-4 h-4" />}
      {status === "rejected" && <XCircle className="w-4 h-4" />}
      {config.label}
    </span>
  );
}
