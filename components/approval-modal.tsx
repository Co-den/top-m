"use client";

import { useState } from "react";
import { X, Download, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

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

interface ApprovalModalProps {
  isOpen: boolean;
  request: DepositRequest;
  onApprove: () => void;
  onReject: (reason: string) => void;
  onClose: () => void;
}

export default function ApprovalModal({
  isOpen,
  request,
  onApprove,
  onReject,
  onClose,
}: ApprovalModalProps) {
  const [rejectionReason, setRejectionReason] = useState("");
  const [showRejectionForm, setShowRejectionForm] = useState(false);

  if (!isOpen) return null;

  // Handle rejection submission
  const handleRejectSubmit = () => {
    if (rejectionReason.trim()) {
      onReject(rejectionReason);
      setRejectionReason("");
      setShowRejectionForm(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-slate-900 rounded-xl border border-slate-800 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-slate-800 border-b border-slate-700 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">Deposit Review</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* User Information */}
          <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
            <h3 className="text-sm font-semibold text-slate-300 mb-4">
              User Information
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-slate-400 text-sm">Full Name</p>
                <p className="text-white font-medium">{request.userName}</p>
              </div>
              <div>
                <p className="text-slate-400 text-sm">Email</p>
                <p className="text-white font-medium">{request.email}</p>
              </div>
              <div>
                <p className="text-slate-400 text-sm">User ID</p>
                <p className="text-white font-medium">{request.userId}</p>
              </div>
              <div>
                <p className="text-slate-400 text-sm">Submission Date</p>
                <p className="text-white font-medium">{request.submittedDate}</p>
              </div>
            </div>
          </div>

          {/* Investment Details */}
          <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
            <h3 className="text-sm font-semibold text-slate-300 mb-4">
              Deposit Details
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-slate-400 text-sm">Deposit Amount</p>
                <p className="text-white font-medium text-lg">
                  ₦{request.amount.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          {/* Payment Proof */}
          <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
            <h3 className="text-sm font-semibold text-slate-300 mb-4">
              Payment Proof Verification
            </h3>
            <div className="bg-slate-900 rounded-lg p-4 flex items-center justify-between">
              <div>
                <p className="text-white font-medium">Payment Proof Document</p>
                <p className="text-slate-400 text-sm">{request.paymentProof}</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="text-pink-500 hover:bg-pink-500/10"
              >
                <Download className="w-4 h-4 mr-2" />
                View
              </Button>
            </div>
          </div>

          {/* Verification Checklist */}
          <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
            <h3 className="text-sm font-semibold text-slate-300 mb-4">
              Verification Checklist
            </h3>
            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  defaultChecked
                  className="w-4 h-4 rounded bg-slate-700 border-slate-600 text-pink-500"
                />
                <span className="text-slate-300 text-sm">
                  Payment proof is valid and authentic
                </span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  defaultChecked
                  className="w-4 h-4 rounded bg-slate-700 border-slate-600 text-pink-500"
                />
                <span className="text-slate-300 text-sm">
                  Amount matches investment plan
                </span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  defaultChecked
                  className="w-4 h-4 rounded bg-slate-700 border-slate-600 text-pink-500"
                />
                <span className="text-slate-300 text-sm">
                  User information is complete and verified
                </span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  defaultChecked
                  className="w-4 h-4 rounded bg-slate-700 border-slate-600 text-pink-500"
                />
                <span className="text-slate-300 text-sm">
                  No compliance or fraud concerns
                </span>
              </label>
            </div>
          </div>

          {/* Rejection Form (Conditional) */}
          {showRejectionForm && (
            <div className="bg-red-500/10 rounded-lg p-4 border border-red-500/30">
              <div className="flex items-start gap-3 mb-4">
                <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-red-300 mb-2">
                    Rejection Reason
                  </h4>
                  <p className="text-red-300/80 text-sm">
                    Please provide a reason for rejecting this application
                  </p>
                </div>
              </div>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Enter reason for rejection..."
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                rows={4}
              />
            </div>
          )}

          {/* Status Display for Reviewed Items */}
          {request.status !== "pending" && (
            <div
              className={`rounded-lg p-4 border ${
                request.status === "approved"
                  ? "bg-emerald-500/10 border-emerald-500/30"
                  : "bg-red-500/10 border-red-500/30"
              }`}
            >
              <p
                className={
                  request.status === "approved"
                    ? "text-emerald-300"
                    : "text-red-300"
                }
              >
                This application has been {request.status}
              </p>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        {request.status === "pending" && (
          <div className="sticky bottom-0 bg-slate-800 border-t border-slate-700 px-6 py-4 flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={onClose}
              className="text-slate-300 hover:bg-slate-700"
            >
              Cancel
            </Button>

            <div className="flex items-center gap-3">
              {!showRejectionForm ? (
                <>
                  <Button
                    onClick={() => setShowRejectionForm(true)}
                    className="bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/50"
                    variant="outline"
                  >
                    Reject
                  </Button>
                  <Button
                    onClick={onApprove}
                    className="bg-emerald-500 hover:bg-emerald-600 text-white"
                  >
                    Approve Plan
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    onClick={() => setShowRejectionForm(false)}
                    variant="ghost"
                    className="text-slate-300"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleRejectSubmit}
                    disabled={!rejectionReason.trim()}
                    className="bg-red-500 hover:bg-red-600 text-white disabled:opacity-50"
                  >
                    Confirm Rejection
                  </Button>
                </>
              )}
            </div>
          </div>
        )}

        {request.status !== "pending" && (
          <div className="bg-slate-800 border-t border-slate-700 px-6 py-4 flex items-center justify-end gap-3">
            <Button
              onClick={onClose}
              className="bg-pink-500 hover:bg-pink-600 text-white"
            >
              Close
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
