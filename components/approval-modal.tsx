"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

interface DepositRequest {
  id: string
  userId: string
  userName: string
  email: string
  plan: string
  amount: number
  paymentProof: string
  status: "pending" | "approved" | "rejected"
  submittedDate: string
}

interface ApprovalModalProps {
  isOpen: boolean
  request: DepositRequest
  onApprove: () => void
  onReject: (reason: string) => void
  onClose: () => void
}

export default function ApprovalModal({ isOpen, request, onApprove, onReject, onClose }: ApprovalModalProps) {
  const [rejectionReason, setRejectionReason] = useState("")
  const [isRejecting, setIsRejecting] = useState(false)
  const [isApproving, setIsApproving] = useState(false)

  const handleApproveClick = async () => {
    setIsApproving(true)
    await onApprove()
    setIsApproving(false)
  }

  const handleRejectClick = async () => {
    if (!rejectionReason.trim()) {
      alert("Please provide a rejection reason")
      return
    }
    setIsRejecting(true)
    await onReject(rejectionReason)
    setIsRejecting(false)
    setRejectionReason("")
  }

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
              <h2 className="text-2xl font-bold text-white">Review Deposit Request</h2>
              <button onClick={onClose} className="text-slate-400 hover:text-white transition">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-slate-400 text-sm mb-1">User Name</p>
                  <p className="text-white font-semibold">{request.userName}</p>
                </div>
                <div>
                  <p className="text-slate-400 text-sm mb-1">Email</p>
                  <p className="text-white font-semibold">{request.email}</p>
                </div>
                <div>
                  <p className="text-slate-400 text-sm mb-1">Deposit ID</p>
                  <p className="text-white font-semibold">{request.id}</p>
                </div>
                <div>
                  <p className="text-slate-400 text-sm mb-1">Amount</p>
                  <p className="text-white font-semibold">₦{request.amount.toLocaleString()}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-slate-400 text-sm mb-1">Submitted Date</p>
                  <p className="text-white font-semibold">{request.submittedDate}</p>
                </div>
              </div>

              {request.paymentProof && (
                <div>
                  <p className="text-slate-400 text-sm mb-3">Payment Proof</p>
                  <img
                    src={request.paymentProof || "/placeholder.svg"}
                    alt="Payment proof"
                    className="w-full rounded-lg border border-slate-700 max-h-64 object-cover"
                  />
                </div>
              )}

              {request.status === "pending" && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Rejection Reason (if rejecting)</label>
                    <textarea
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                      placeholder="Explain why you're rejecting this request..."
                      className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-pink-500 resize-none"
                      rows={4}
                    />
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button
                      onClick={handleApproveClick}
                      disabled={isApproving}
                      className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white"
                    >
                      {isApproving ? "Approving..." : "Approve"}
                    </Button>
                    <Button
                      onClick={handleRejectClick}
                      disabled={isRejecting}
                      className="flex-1 bg-red-500 hover:bg-red-600 text-white"
                    >
                      {isRejecting ? "Rejecting..." : "Reject"}
                    </Button>
                  </div>
                </>
              )}

              {request.status !== "pending" && (
                <div className="text-center py-4">
                  <p className="text-slate-400">This request has already been {request.status}</p>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
