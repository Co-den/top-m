"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { X, AlertCircle, CheckCircle2 } from "lucide-react";

interface DepositRequest {
  id: string;
  userId: string;
  userName: string;
  email: string;
  amount: number;
  paymentProof: string;
  status: "pending" | "proof-submitted" | "approved" | "rejected";
  submittedDate: string;
  proof?: {
    senderName?: string;
    originalName?: string;
  };
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
  const [isRejecting, setIsRejecting] = useState(false);
  const [isApproving, setIsApproving] = useState(false);

  // Check if proof exists
  const hasProof = Boolean(request.paymentProof && request.paymentProof.trim());
  const canApprove = hasProof && request.status !== "approved";

  const handleApproveClick = async () => {
    if (!hasProof) {
      alert("Cannot approve deposit without payment proof");
      return;
    }
    setIsApproving(true);
    onApprove();
    setIsApproving(false);
  };

  const handleRejectClick = async () => {
    if (!rejectionReason.trim()) {
      alert("Please provide a rejection reason");
      return;
    }
    setIsRejecting(true);
    onReject(rejectionReason);
    setIsRejecting(false);
    setRejectionReason("");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-40"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl max-h-[90vh] overflow-y-auto z-50 bg-slate-900 rounded-2xl border border-slate-800 p-8"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">
                Review Deposit Request
              </h2>
              <button
                onClick={onClose}
                className="text-slate-400 hover:text-white transition"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Proof Status Alert */}
              {!hasProof && request.status === "pending" && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-start gap-3 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg"
                >
                  <AlertCircle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-yellow-500 font-semibold text-sm">
                      No Payment Proof Uploaded
                    </p>
                    <p className="text-yellow-500/80 text-sm mt-1">
                      This deposit cannot be approved until the user submits
                      payment proof.
                    </p>
                  </div>
                </motion.div>
              )}

              {hasProof && request.status === "proof-submitted" && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-start gap-3 p-4 bg-green-500/10 border border-green-500/30 rounded-lg"
                >
                  <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-green-500 font-semibold text-sm">
                      Payment Proof Submitted
                    </p>
                    <p className="text-green-500/80 text-sm mt-1">
                      Review the proof below and approve or reject the deposit.
                    </p>
                  </div>
                </motion.div>
              )}

              {/* User Details */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-slate-400 text-sm mb-1">User Name</p>
                  <p className="text-white font-semibold">{request.userName}</p>
                </div>
                <div>
                  <p className="text-slate-400 text-sm mb-1">Email</p>
                  <p className="text-white font-semibold break-all">
                    {request.email}
                  </p>
                </div>
                <div>
                  <p className="text-slate-400 text-sm mb-1">Deposit ID</p>
                  <p className="text-white font-semibold text-xs">
                    {request.id}
                  </p>
                </div>
                <div>
                  <p className="text-slate-400 text-sm mb-1">Amount</p>
                  <p className="text-white font-semibold text-xl">
                    ₦{request.amount.toLocaleString()}
                  </p>
                </div>
                {request.proof?.senderName && (
                  <div>
                    <p className="text-slate-400 text-sm mb-1">Sender Name</p>
                    <p className="text-white font-semibold">
                      {request.proof.senderName}
                    </p>
                  </div>
                )}
                <div className={request.proof?.senderName ? "" : "col-span-2"}>
                  <p className="text-slate-400 text-sm mb-1">Submitted Date</p>
                  <p className="text-white font-semibold">
                    {request.submittedDate}
                  </p>
                </div>
              </div>

              {/* Payment Proof Section */}
              <div>
                <p className="text-slate-400 text-sm mb-3 font-semibold">
                  Payment Proof
                </p>
                {hasProof ? (
                  <div className="space-y-3">
                    {request.proof?.originalName && (
                      <p className="text-slate-400 text-xs">
                        File: {request.proof.originalName}
                      </p>
                    )}
                    <img
                      src={request.paymentProof}
                      alt="Payment proof"
                      className="w-full rounded-lg border border-slate-700 max-h-96 object-contain bg-slate-800"
                      onError={(e) => {
                        e.currentTarget.src = "/placeholder.svg";
                      }}
                    />
                    <a
                      href={request.paymentProof}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm text-pink-500 hover:text-pink-400 transition"
                    >
                      View full size →
                    </a>
                  </div>
                ) : (
                  <div className="w-full h-48 rounded-lg border-2 border-dashed border-slate-700 flex items-center justify-center bg-slate-800/50">
                    <div className="text-center">
                      <AlertCircle className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                      <p className="text-slate-500 font-medium">
                        No proof uploaded yet
                      </p>
                      <p className="text-slate-600 text-sm mt-1">
                        Waiting for user to submit payment proof
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Section */}
              {request.status === "pending" ||
              request.status === "proof-submitted" ? (
                <>
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Rejection Reason (optional)
                    </label>
                    <textarea
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                      placeholder="Provide a reason if rejecting this deposit..."
                      className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-pink-500 resize-none"
                      rows={4}
                    />
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button
                      onClick={handleApproveClick}
                      disabled={!canApprove || isApproving}
                      className={`flex-1 ${
                        canApprove
                          ? "bg-emerald-500 hover:bg-emerald-600"
                          : "bg-slate-700 cursor-not-allowed"
                      } text-white transition-all`}
                      title={
                        !hasProof ? "Cannot approve without payment proof" : ""
                      }
                    >
                      {isApproving
                        ? "Approving..."
                        : canApprove
                        ? "Approve Deposit"
                        : "Proof Required"}
                    </Button>
                    <Button
                      onClick={handleRejectClick}
                      disabled={isRejecting}
                      className="flex-1 bg-red-500 hover:bg-red-600 text-white"
                    >
                      {isRejecting ? "Rejecting..." : "Reject"}
                    </Button>
                  </div>

                  {!canApprove && (
                    <p className="text-center text-sm text-slate-400">
                      <AlertCircle className="w-4 h-4 inline mr-1" />
                      Approval requires valid payment proof from the user
                    </p>
                  )}
                </>
              ) : (
                <div className="text-center py-6 bg-slate-800/50 rounded-lg border border-slate-700">
                  <p className="text-slate-300 font-semibold capitalize">
                    Status: {request.status}
                  </p>
                  <p className="text-slate-500 text-sm mt-1">
                    This deposit has already been processed
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
