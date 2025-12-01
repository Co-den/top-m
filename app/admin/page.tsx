"use client";

import { useState, useEffect } from "react";
import { CheckCircle2, XCircle, Eye, Filter, LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import ApprovalModal from "@/components/approval-modal";

interface InvestmentRequest {
  id: string;
  userId: string;
  userName: string;
  email: string;
  plan: string;
  amount: number;
  paymentProof: string;
  status: "pending" | "approved" | "rejected";
  submittedDate: string;
  planDuration: string;
  expectedReturn: string;
}

export default function AdminDashboard() {
  const [requests, setRequests] = useState<InvestmentRequest[]>([]);
  const [selectedRequest, setSelectedRequest] =
    useState<InvestmentRequest | null>(null);
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

  // Fetch pending users from backend
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
        throw new Error("Failed to fetch pending requests");
      }

      const data = await response.json();
      setRequests(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      console.error("Failed to fetch requests:", err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch requests on component mount
  useEffect(() => {
    verifyAuthAndFetch();
  }, []);

  // Verify authentication and fetch data
  const verifyAuthAndFetch = async () => {
    try {
      // First verify authentication
      const authResponse = await fetch(
        "https://top-mart-api.onrender.com/api/admin/verify",
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        }
      );

      if (!authResponse.ok) {
        // Not authenticated, redirect to login
        window.location.href = "/admin-auth";
        return;
      }

      const authData = await authResponse.json();
      setAdminUser(authData.user);

      // Then fetch requests
      await fetchRequests();
    } catch (err) {
      console.error("Auth verification failed:", err);
      window.location.href = "/admin-auth";
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("https://top-mart-api.onrender.com/api/admin/logout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      window.location.href = "/admin-auth";
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const pendingRequests = requests.filter((r) => r.status === "pending");
  const approvedCount = requests.filter((r) => r.status === "approved").length;
  const rejectedCount = requests.filter((r) => r.status === "rejected").length;

  const filteredRequests =
    filterStatus === "all"
      ? requests
      : requests.filter((r) => r.status === filterStatus);

  const handleApprove = async (requestId: string) => {
    try {
      await fetch(
        `https://top-mart-api.onrender.com/api/approval/approve/${requestId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        }
      );
      setRequests((prev) =>
        prev.map((r) => (r.id === requestId ? { ...r, status: "approved" } : r))
      );
      setIsModalOpen(false);
      // Optionally refetch to ensure data is in sync
      // await fetchRequests();
    } catch (err) {
      console.error("Failed to approve:", err);
    }
  };

  const handleReject = async (requestId: string, reason: string) => {
    try {
      await fetch(
        `https://top-mart-api.onrender.com/api/admin/reject/${requestId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ reason }),
        }
      );
      setRequests((prev) =>
        prev.map((r) => (r.id === requestId ? { ...r, status: "rejected" } : r))
      );
      setIsModalOpen(false);
      // Optionally refetch to ensure data is in sync
      await fetchRequests();
    } catch (err) {
      console.error("Failed to reject:", err);
    }
  };

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
                Manage and approve user investment plan applications
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
              value={pendingRequests.length}
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
                  {filteredRequests.map((request) => (
                    <tr
                      key={request.id}
                      className="hover:bg-slate-800/50 transition"
                    >
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-white font-medium">
                            {request.userName}
                          </p>
                          <p className="text-slate-400 text-sm">
                            {request.email}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-white">{request.plan}</span>
                        <p className="text-slate-400 text-sm">
                          {request.planDuration}
                        </p>
                      </td>
                      <td className="px-6 py-4 text-white font-semibold">
                        ₦{request.amount.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-emerald-400 font-medium">
                        {request.expectedReturn}
                      </td>
                      <td className="px-6 py-4 text-slate-400 text-sm">
                        {request.submittedDate}
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={request.status} />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {request.status === "pending" && (
                            <>
                              <Button
                                size="sm"
                                onClick={() => {
                                  setSelectedRequest(request);
                                  setIsModalOpen(true);
                                }}
                                className="bg-pink-500 hover:bg-pink-600 text-white h-8 px-3"
                              >
                                Review
                              </Button>
                            </>
                          )}
                          {request.status !== "pending" && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => {
                                setSelectedRequest(request);
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
                  ))}
                </tbody>
              </table>
            </div>

            {filteredRequests.length === 0 && (
              <div className="px-6 py-12 text-center">
                <p className="text-slate-400">
                  No requests found with the selected filter.
                </p>
              </div>
            )}
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
