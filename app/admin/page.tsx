"use client";

import { useState, useEffect } from "react";
import { Eye, Search, Bell, LogOut, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import ApprovalModal from "@/components/approval-modal";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  TrendingUp,
  CreditCard,
  MessageCircle,
  BarChart3,
} from "lucide-react";
import AnalysisPage from "../analysis/page";
import ChatPage from "../chat/page";
import PlansPage from "../plans/page";
import InvestmentsPage from "../investments/page";
import UsersPage from "../users/page";

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

type PageView =
  | "dashboard"
  | "users"
  | "investments"
  | "plans"
  | "deposits"
  | "chat"
  | "analysis";

export default function AdminDashboard() {
  const [requests, setRequests] = useState<DepositRequest[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<DepositRequest | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState<
    "all" | "pending" | "approved" | "rejected"
  >("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [adminUser, setAdminUser] = useState<{
    fullName: string;
    email: string;
  } | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState<PageView>("deposits");

  const approvedCount = requests.filter((r) => r.status === "approved").length;
  const rejectedCount = requests.filter((r) => r.status === "rejected").length;
  const pendingCount = requests.filter((r) => r.status === "pending").length;

  let filteredRequests =
    filterStatus === "all"
      ? requests
      : requests.filter((r) => r.status === filterStatus);

  if (searchTerm.trim()) {
    filteredRequests = filteredRequests.filter(
      (r) =>
        r.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

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
      console.error("[v0] Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  

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
        fetchRequests();
        return;
      }

      const authData = await authResponse.json().catch(() => ({}));
      const rawUser =
        authData?.user ?? authData?.data?.user ?? authData?.admin ?? authData;
      const fullName =
        rawUser?.fullName ??
        rawUser?.name ??
        (`${rawUser?.firstName ?? ""} ${rawUser?.lastName ?? ""}`.trim() || "");
      const email = rawUser?.email ?? rawUser?.emailAddress ?? "";
      setAdminUser({ fullName, email });

      await fetchRequests();
    } catch (err) {
      console.error("[v0] Auth verification error:", err);
      fetchRequests();
    }
  };

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
        console.error("[v0] Approve failed:", response.status, bodyText);
        throw new Error(`Approve failed: ${response.status}`);
      }

      setRequests((prev) =>
        prev.map((r) => (r.id === depositId ? { ...r, status: "approved" } : r))
      );
      setFilterStatus("all");
      setSelectedRequest(null);
      setIsModalOpen(false);

      await fetchRequests();
    } catch (err) {
      console.error("[v0] Approve error:", err);
      setRequests((prev) =>
        prev.map((r) => (r.id === depositId ? { ...r, status: "approved" } : r))
      );
      setSelectedRequest(null);
      setIsModalOpen(false);
    }
  };

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
        console.error("[v0] Reject failed:", response.status, bodyText);
        throw new Error(`Reject failed: ${response.status}`);
      }

      setRequests((prev) =>
        prev.map((r) => (r.id === depositId ? { ...r, status: "rejected" } : r))
      );
      setIsModalOpen(false);
      await fetchRequests();
    } catch (err) {
      console.error("[v0] Reject error:", err);
      setRequests((prev) =>
        prev.map((r) => (r.id === depositId ? { ...r, status: "rejected" } : r))
      );
      setIsModalOpen(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("https://top-mart-api.onrender.com/api/admin/logout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
    } catch (err) {
      console.error("[v0] Logout error:", err);
    } finally {
      window.location.href = "/admin-auth";
    }
  };

  useEffect(() => {
    verifyAuthAndFetch();
  }, []);

  const navItems = [
    { id: "dashboard" as PageView, label: "Dashboards", icon: LayoutDashboard },
    { id: "users" as PageView, label: "Users", icon: Users },
    { id: "investments" as PageView, label: "Investments", icon: TrendingUp },
    { id: "plans" as PageView, label: "Plans", icon: CreditCard },
    { id: "deposits" as PageView, label: "Deposits", icon: CreditCard },
    { id: "chat" as PageView, label: "Chat", icon: MessageCircle },
    { id: "analysis" as PageView, label: "Analysis", icon: BarChart3 },
  ];

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: sidebarOpen ? 280 : 0 }}
        transition={{ duration: 0.3 }}
        className="hidden md:flex bg-card border-r border-border flex-col overflow-hidden shrink-0"
      >
        <div className="p-6 border-b border-border">
          <h2 className="text-2xl font-bold text-pink-500">TopMart</h2>
          <p className="text-sm text-muted-foreground">Admin</p>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <div className="px-4 py-2">
            <p className="text-xs font-semibold text-muted-foreground uppercase">
              Main
            </p>
          </div>
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setCurrentPage(item.id)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                currentPage === item.id
                  ? "bg-pink-500 text-primary-foreground"
                  : "text-foreground hover:bg-pink-500"
              )}
            >
              <item.icon className="h-5 w-5" />
              <span className="text-sm font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        {adminUser && (
          <div className="p-4 border-t border-border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                <span className="text-sm font-bold text-primary">
                  {adminUser.fullName.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="text-sm flex-1 min-w-0">
                <p className="font-medium text-foreground truncate">
                  {adminUser.fullName}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {adminUser.email}
                </p>
              </div>
            </div>
          </div>
        )}
      </motion.aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-card border-b border-border px-6 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="md:hidden"
              >
                {sidebarOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </Button>
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search [CTRL + K]"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-muted border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute top-1 right-1 h-2 w-2 bg-destructive rounded-full" />
              </Button>
              <Button variant="ghost" size="icon" onClick={handleLogout}>
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto">
          <AnimatePresence mode="wait">
            {currentPage === "deposits" && (
              <DepositsPage
                key="deposits"
                requests={requests}
                filteredRequests={filteredRequests}
                filterStatus={filterStatus}
                setFilterStatus={setFilterStatus}
                loading={loading}
                error={error}
                fetchRequests={fetchRequests}
                approvedCount={approvedCount}
                rejectedCount={rejectedCount}
                pendingCount={pendingCount}
                setSelectedRequest={setSelectedRequest}
                setIsModalOpen={setIsModalOpen}
              />
            )}
            {currentPage === "dashboard" && (
              <PlaceholderPage key="dashboard" title="Dashboard" />
            )}
            {currentPage === "users" && (
              <UsersPage key="users" />
            )}
            {currentPage === "investments" && (
              <InvestmentsPage key="investments" />
            )}
            {currentPage === "plans" && (
              <PlansPage key="plans" />
            )}
            {currentPage === "chat" && (
              <ChatPage key="chat"/>
            )}
            {currentPage === "analysis" && (
              <AnalysisPage key="analysis" />
            )}
          </AnimatePresence>
        </main>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selectedRequest && (
          <ApprovalModal
            isOpen={isModalOpen}
            request={selectedRequest}
            onApprove={() => handleApprove(selectedRequest.id)}
            onReject={(reason) => handleReject(selectedRequest.id, reason)}
            onClose={() => setIsModalOpen(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function PlaceholderPage({ title }: { title: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="p-6 space-y-6"
    >
      <div>
        <h1 className="text-4xl font-bold text-primary mb-2">{title}</h1>
        <p className="text-muted-foreground">This page is under construction</p>
      </div>
      <div className="bg-card rounded-xl border border-border p-12 text-center">
        <div className="text-6xl mb-4">🚧</div>
        <p className="text-lg text-muted-foreground">
          The {title.toLowerCase()} page will be available soon
        </p>
      </div>
    </motion.div>
  );
}

function DepositsPage({
  requests,
  filteredRequests,
  filterStatus,
  setFilterStatus,
  loading,
  error,
  fetchRequests,
  approvedCount,
  rejectedCount,
  pendingCount,
  setSelectedRequest,
  setIsModalOpen,
}: any) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="p-6 space-y-6"
    >
      <div>
        <h1 className="text-4xl font-bold text-pink-500 mb-2">
          Deposits Management
        </h1>
        <p className="text-muted-foreground">
          Manage and approve user deposits applications
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-yellow-50 dark:bg-yellow-950/30 rounded-xl p-6 border border-yellow-200 dark:border-yellow-900/30">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-yellow-700 dark:text-yellow-400 opacity-75 mb-2">
                Pending Approvals
              </p>
              <p className="text-3xl font-bold text-yellow-700 dark:text-yellow-400">
                {pendingCount}
              </p>
            </div>
            <span className="text-2xl">⏳</span>
          </div>
        </div>

        <div className="bg-green-50 dark:bg-green-950/30 rounded-xl p-6 border border-green-200 dark:border-green-900/30">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-green-700 dark:text-green-400 opacity-75 mb-2">
                Approved Plans
              </p>
              <p className="text-3xl font-bold text-green-700 dark:text-green-400">
                {approvedCount}
              </p>
            </div>
            <span className="text-2xl">✓</span>
          </div>
        </div>

        <div className="bg-red-50 dark:bg-red-950/30 rounded-xl p-6 border border-red-200 dark:border-red-900/30">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-red-700 dark:text-red-400 opacity-75 mb-2">
                Rejected Plans
              </p>
              <p className="text-3xl font-bold text-red-700 dark:text-red-400">
                {rejectedCount}
              </p>
            </div>
            <span className="text-2xl">✕</span>
          </div>
        </div>

        <div className="bg-blue-50 dark:bg-blue-950/30 rounded-xl p-6 border border-blue-200 dark:border-blue-900/30">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-blue-700 dark:text-blue-400 opacity-75 mb-2">
                Total Invested
              </p>
              <p className="text-3xl font-bold text-blue-700 dark:text-blue-400">
                ₦
                {requests
                  .reduce(
                    (sum: number, r: any) =>
                      r.status === "approved" ? sum + r.amount : sum,
                    0
                  )
                  .toLocaleString()}
              </p>
            </div>
            <span className="text-2xl">💰</span>
          </div>
        </div>
      </div>

      {/* Filter Buttons */}
      <div className="flex flex-wrap items-center gap-3">
        <span className="text-sm font-medium text-foreground flex items-center gap-2">
          <span>Filter:</span>
        </span>
        {(["all", "pending", "approved", "rejected"] as const).map((status) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              filterStatus === status
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-foreground hover:bg-accent"
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      {/* Loading, Error, and Empty States */}
      <AnimatePresence>
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center justify-center py-12"
          >
            <div className="rounded-full h-12 w-12 border-b-2 border-primary animate-spin" />
          </motion.div>
        )}

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="bg-destructive/10 border border-destructive/20 rounded-lg p-4"
          >
            <p className="text-destructive">Error: {error}</p>
            <Button
              onClick={fetchRequests}
              className="mt-2 bg-destructive hover:bg-destructive/90 text-white"
            >
              Retry
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Data Table */}
      {!loading && !error && (
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted border-b border-border">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                    User
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                    Email
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                    Role
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-border">
                <AnimatePresence>
                  {filteredRequests.length === 0 ? (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-6 py-12 text-center text-muted-foreground"
                      >
                        No requests found with the selected filter.
                      </td>
                    </tr>
                  ) : (
                    filteredRequests.map((r: any, idx: number) => (
                      <motion.tr
                        key={r.id || r.userId || idx}
                        layout
                        initial={{ opacity: 0, x: -6 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 6 }}
                        transition={{ delay: idx * 0.03 }}
                        className="hover:bg-muted/50 transition"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                              <span className="text-xs font-bold text-primary">
                                {r.userName.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div>
                              <p className="font-medium text-foreground text-sm">
                                {r.userName}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                @{r.userName.toLowerCase().replace(/\s+/g, "")}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-4 text-sm text-foreground">
                          {r.email}
                        </td>

                        <td className="px-6 py-4">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                            {r.plan}
                          </span>
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
                                className="bg-primary hover:bg-primary/90 text-primary-foreground h-8 px-3 text-xs"
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
                                className="text-muted-foreground h-8"
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                        </td>
                      </motion.tr>
                    ))
                  )}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </motion.div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const statusConfig = {
    pending: {
      bg: "bg-yellow-50 dark:bg-yellow-950/30",
      text: "text-yellow-700 dark:text-yellow-400",
      label: "Pending",
    },
    approved: {
      bg: "bg-green-50 dark:bg-green-950/30",
      text: "text-green-700 dark:text-green-400",
      label: "Approved",
    },
    rejected: {
      bg: "bg-red-50 dark:bg-red-950/30",
      text: "text-red-700 dark:text-red-400",
      label: "Rejected",
    },
  };

  const config =
    statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}
    >
      {config.label}
    </span>
  );
}
