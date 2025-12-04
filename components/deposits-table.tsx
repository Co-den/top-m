// DepositsTable.tsx
"use client";

import React, { JSX, useEffect, useMemo, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Download, Check, X } from "lucide-react";

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

export default function DepositsTable(): JSX.Element {
  const [requests, setRequests] = useState<DepositRequest[]>([]);

  // UI state
  const [statusFilter, setStatusFilter] = useState<
    "all" | DepositRequest["status"]
  >("all");
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 8;

  // Modal state
  const [openProof, setOpenProof] = useState<{
    filename: string;
    id?: string;
  } | null>(null);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  // debounce query
  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(query.trim()), 300);
    return () => clearTimeout(t);
  }, [query]);

  // Fetch from API and normalize
  const fetchDeposits = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch(`${API_BASE}/api/approval/pending-users`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error(`Failed to fetch deposits (${res.status})`);
      }

      const json = await res.json().catch(() => null);
      const raw = Array.isArray(json) ? json : json?.data ?? json?.proofs ?? [];

      const mapped: Deposit[] = (Array.isArray(raw) ? raw : []).map(
        (p: any) => {
          const user = p.userId ?? p.user ?? {};
          const created = p.createdAt ?? p.submittedAt ?? p.date ?? p.created;

          return {
            id: String(p._id ?? p.id ?? ""),
            userName:
              user?.fullName ??
              user?.name ??
              (`${user?.firstName ?? ""} ${user?.lastName ?? ""}`.trim() ||
                "Unknown"),
            email: user?.email ?? p.email ?? "",
            amount:
              Number(p.amount ?? p.investmentAmount ?? p.proofAmount ?? 0) || 0,
            submitted: created
              ? new Date(created).toLocaleString()
              : p.submittedDate ?? "",
            status: (p.status ?? "pending") as Deposit["status"],
            paymentProof:
              p.paymentProof ?? p.proofUrl ?? p.receiptUrl ?? p.fileName ?? "",
          };
        }
      );

      setDeposits(mapped);
    } catch (err) {
      console.error("fetchDeposits error:", err);
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeposits();
  }, []);

  // Derived filtered + searched list
  const filtered = useMemo(() => {
    let list = deposits;
    if (statusFilter !== "all") {
      list = list.filter((d) => d.status === statusFilter);
    }

    if (debouncedQuery) {
      const q = debouncedQuery.toLowerCase();
      list = list.filter((d) => {
        return (
          d.userName.toLowerCase().includes(q) ||
          (d.email ?? "").toLowerCase().includes(q) ||
          d.id.toLowerCase().includes(q) ||
          String(d.amount).toLowerCase().includes(q)
        );
      });
    }
    return list;
  }, [deposits, statusFilter, debouncedQuery]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [totalPages, page]);

  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // Helpers
  const getProofUrl = (filename?: string) => {
    if (!filename) return "";
    // If filename already looks like a full URL return it
    if (filename.startsWith("http://") || filename.startsWith("https://"))
      return filename;
    // Otherwise prefix with PROOF_BASE_URL
    return `${PROOF_BASE_URL.replace(/\/$/, "")}/${filename.replace(
      /^\/+/,
      ""
    )}`;
  };

  // Approve/reject functions (optimistic update, then call API)
  // NOTE: API endpoint used here is generic — change to match your backend if different
  const updateStatus = async (id: string, newStatus: Deposit["status"]) => {
    if (!window.confirm(`Set request ${id} to "${newStatus}"?`)) return;

    setActionLoadingId(id);
    const previous = deposits;
    setDeposits((prev) =>
      prev.map((d) => (d.id === id ? { ...d, status: newStatus } : d))
    );

    try {
      const res = await fetch(
        `${API_BASE}/api/deposits/${encodeURIComponent(id)}/status`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (!res.ok) {
        // try alternative endpoint (some backends use /update or /approve)
        // if both fail we throw and rollback
        const alt = await fetch(
          `${API_BASE}/api/deposits/${encodeURIComponent(id)}`,
          {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ status: newStatus }),
          }
        );
        if (!alt.ok) throw new Error("Failed to update status");
      }
    } catch (err) {
      console.error("updateStatus error:", err);
      setError(err instanceof Error ? err.message : "Failed to update status");
      // rollback
      setDeposits(previous);
    } finally {
      setActionLoadingId(null);
    }
  };

  // Manual refresh
  const handleRefresh = () => {
    fetchDeposits();
  };

  return (
    <Card className="bg-card border-0 shadow-sm">
      <CardHeader className="flex items-center justify-between gap-4 border-b border-border">
        <div>
          <CardTitle>Recent Deposits</CardTitle>
          <p className="text-sm text-muted-foreground">
            Manage incoming deposit proofs and approvals
          </p>
        </div>

        <div className="flex items-center gap-2">
          <input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
            placeholder="Search by name, email, id or amount..."
            className="input px-3 py-2 rounded-md border"
            style={{ minWidth: 260 }}
          />

          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value as any);
              setPage(1);
            }}
            className="select px-3 py-2 rounded-md border"
          >
            <option value="all">All statuses</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>

          <Button onClick={handleRefresh} variant="ghost" size="sm">
            Refresh
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        {loading ? (
          <div className="py-10 text-center text-muted-foreground">
            Loading deposits...
          </div>
        ) : error ? (
          <div className="py-4 px-6 text-red-500">{error}</div>
        ) : deposits.length === 0 ? (
          <div className="flex items-center justify-center py-12 text-center">
            <div>
              <p className="text-muted-foreground text-lg">
                No deposits found.
              </p>
              <p className="text-muted-foreground text-sm mt-1">
                Deposits will appear here once users submit them.
              </p>
            </div>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-muted/50">
                  <TableRow className="border-border hover:bg-transparent">
                    <TableHead className="font-semibold">User</TableHead>
                    <TableHead className="font-semibold">Amount</TableHead>
                    <TableHead className="font-semibold">Submitted</TableHead>
                    <TableHead className="font-semibold">Status</TableHead>
                    <TableHead className="font-semibold">Proof</TableHead>
                    <TableHead className="font-semibold">Actions</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {pageItems.map((d) => (
                    <TableRow
                      key={d.id}
                      className="border-border hover:bg-muted/30"
                    >
                      <TableCell className="font-medium">
                        <div className="flex flex-col">
                          <span>{d.userName}</span>
                          {d.email && (
                            <small className="text-muted-foreground">
                              {d.email}
                            </small>
                          )}
                        </div>
                      </TableCell>

                      <TableCell>
                        ₦{Number(d.amount).toLocaleString()}
                      </TableCell>

                      <TableCell>{d.submitted}</TableCell>

                      <TableCell>
                        <Badge
                          className={
                            d.status === "approved"
                              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                              : d.status === "rejected"
                              ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                              : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                          }
                        >
                          {d.status}
                        </Badge>
                      </TableCell>

                      <TableCell>
                        {d.paymentProof ? (
                          <div className="flex gap-2 items-center">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                setOpenProof({
                                  filename: d.paymentProof ?? "",
                                  id: d.id,
                                })
                              }
                              title="View proof"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <a
                              href={getProofUrl(d.paymentProof)}
                              download
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-2 text-sm"
                            >
                              <Download className="h-4 w-4" />
                              <span className="sr-only">Download proof</span>
                            </a>
                          </div>
                        ) : (
                          <span className="text-sm text-muted-foreground">
                            No proof
                          </span>
                        )}
                      </TableCell>

                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => updateStatus(d.id, "approved")}
                            disabled={
                              d.status === "approved" ||
                              actionLoadingId === d.id
                            }
                            title="Approve"
                          >
                            <Check className="h-4 w-4" />
                          </Button>

                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => updateStatus(d.id, "rejected")}
                            disabled={
                              d.status === "rejected" ||
                              actionLoadingId === d.id
                            }
                            title="Reject"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between px-4 py-3 border-t border-border">
              <div className="text-sm text-muted-foreground">
                Showing {(page - 1) * PAGE_SIZE + 1} -{" "}
                {Math.min(page * PAGE_SIZE, filtered.length)} of{" "}
                {filtered.length}
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  Prev
                </Button>

                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }).map((_, i) => {
                    const pageNum = i + 1;
                    const active = pageNum === page;
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setPage(pageNum)}
                        className={`px-2 py-1 rounded-md text-sm ${
                          active ? "bg-primary/20" : "hover:bg-muted/30"
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          </>
        )}
      </CardContent>

      {/* Proof Modal */}
      {openProof && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={() => setOpenProof(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="bg-card rounded-lg shadow-lg max-w-3xl w-full mx-4 p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <h3 className="text-lg font-semibold">Payment Proof</h3>
              <div className="flex gap-2 items-center">
                <a
                  href={getProofUrl(openProof.filename)}
                  download
                  target="_blank"
                  rel="noreferrer"
                >
                  <Button variant="ghost" size="sm">
                    <Download className="h-4 w-4" />
                  </Button>
                </a>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setOpenProof(null)}
                >
                  Close
                </Button>
              </div>
            </div>

            <div className="mt-4">
              <img
                src={getProofUrl(openProof.filename)}
                alt="Payment proof"
                className="w-full max-h-[70vh] object-contain rounded-md bg-muted/10"
              />
              <p className="mt-2 text-xs text-muted-foreground">
                File: {openProof.filename}
              </p>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}
