"use client";

import { useState, useEffect } from "react";
import { AlertCircle, ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { BottomNav } from "@/components/bottom-nav";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

export default function WithdrawPage() {
  const [user, setUser] = useState<any>(null);
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          "https://top-mart-api.onrender.com/api/users/me",
          {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          }
        );
        setUser(res.data);
      } catch (err) {
        console.error("Failed to fetch user profile", err);
      }
    };
    fetchUser();
  }, []);

  const handleWithdraw = async () => {
    if (!withdrawAmount) {
      toast.error("Please enter a withdrawal amount");
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        "https://top-mart-api.onrender.com/api/withdrawal/withdraw",
        { amount: Number(withdrawAmount) },
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );

      toast.success(res.data.message, {
        style: {
          background: "#ec4899",
          color: "#fff",
          fontWeight: "bold",
          borderRadius: "0.75rem",
          padding: "1rem",
        },
        icon: "✅",
      });

      setUser((prev: any) => ({
        ...prev,
        balance: res.data.newBalance,
      }));
      setWithdrawAmount("");
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? "Withdrawal failed", {
        style: {
          background: "#dc2626",
          color: "#fff",
          fontWeight: "bold",
          borderRadius: "0.75rem",
          padding: "1rem",
        },
        icon: "⚠️",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.36, ease: "easeOut" }}
      className="min-h-screen bg-gray-50"
    >
      {/* Header */}
      <motion.div
        initial={{ y: -6, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="bg-pink-600 text-white px-4 py-6 flex items-center justify-between"
      >
        <Link href="/profile" className="flex items-center">
          <motion.div whileTap={{ scale: 0.95 }} whileHover={{ scale: 1.05 }}>
            <ArrowLeft className="w-6 h-6" />
          </motion.div>
        </Link>
        <h1 className="text-xl font-bold">Withdraw</h1>
        <Link href="/withdraw-records" className="text-sm font-medium">
          <motion.div whileTap={{ scale: 0.95 }} whileHover={{ scale: 1.05 }}>
            Records
          </motion.div>
        </Link>
      </motion.div>

      {/* Main Content */}
      <div className="px-4 py-6 max-w-2xl mx-auto">
        {/* Balance Card */}
        <motion.div
          layout
          initial={{ opacity: 0, scale: 0.995 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.05, duration: 0.32 }}
          className="bg-pink-600 text-white rounded-2xl p-6 mb-6 shadow-md"
        >
          <motion.p
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 }}
            className="text-sm font-medium mb-2"
          >
            My Balance
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="text-4xl font-bold"
          >
            ₦{user?.balance ?? 0}
          </motion.h2>
        </motion.div>

        {/* Account Details */}
        <motion.div
          layout
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12, duration: 0.32 }}
          className="bg-white rounded-lg p-6 mb-6 border border-gray-200 shadow-sm"
        >
          <div className="flex items-center gap-2 mb-4">
            <motion.div
              whileTap={{ scale: 0.95 }}
              className="w-6 h-6 bg-pink-600 rounded-lg flex items-center justify-center text-white text-xs"
            >
              🏦
            </motion.div>
            <h3 className="text-lg font-bold text-pink-600">
              My Account Details
            </h3>
          </div>
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.14, staggerChildren: 0.05 }}
          >
            <motion.div
              initial={{ opacity: 0, x: -4 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <p className="text-sm text-gray-600 font-medium">Account Name:</p>
              <p className="text-gray-800 font-semibold">
                {user?.bankAccount?.accountName ?? "Not set"}
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: -4 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.05 }}
            >
              <p className="text-sm text-gray-600 font-medium">Account Number:</p>
              <p className="text-gray-800 font-semibold">
                {user?.bankAccount?.accountNumber ?? "Not set"}
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: -4 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <p className="text-sm text-gray-600 font-medium">Bank Name:</p>
              <p className="text-gray-800 font-semibold">
                {user?.bankAccount?.bankName ?? "Not set"}
              </p>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Withdrawal Amount */}
        <motion.div
          layout
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.18, duration: 0.32 }}
          className="bg-white rounded-lg p-6 border border-gray-200 mb-6 shadow-sm"
        >
          <h3 className="text-lg font-bold text-pink-600 mb-4">
            Withdrawal Amount
          </h3>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">
              ₦
            </span>
            <motion.input
              type="number"
              placeholder="Enter withdrawal amount"
              value={withdrawAmount}
              onChange={(e) => setWithdrawAmount(e.target.value)}
              whileFocus={{ scale: 1.01 }}
              className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-600 placeholder-gray-400"
            />
          </div>
        </motion.div>

        {/* Withdraw Button */}
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.22 }}
        >
          <motion.div whileTap={{ scale: 0.98 }} whileHover={{ scale: 1.02 }}>
            <Button
              onClick={handleWithdraw}
              disabled={loading}
              className="w-full bg-pink-600 hover:bg-pink-700 text-white py-6 rounded-lg font-bold text-lg disabled:opacity-60"
            >
              {loading ? "Processing..." : "Withdraw Funds"}
            </Button>
          </motion.div>
        </motion.div>

        {/* Info Section */}
        <motion.div
          layout
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.24, duration: 0.32 }}
          className="mt-6"
        >
          <div className="bg-white rounded-lg p-6 py-7 shadow-sm">
            <div className="flex items-start gap-3 mb-4">
              <motion.div whileTap={{ scale: 0.95 }} whileHover={{ scale: 1.05 }}>
                <AlertCircle
                  size={20}
                  className="text-pink-500 shrink-0 mt-0.5"
                />
              </motion.div>
              <h3 className="font-semibold text-gray-800">
                Withdrawal Information
              </h3>
            </div>
            <motion.ul
              className="space-y-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.26, staggerChildren: 0.04 }}
            >
              {["Withdraw Minimum Amount: ₦1000", "Withdrawal charges: 10%", "Withdrawals processed within 24 hours"].map(
                (item, idx) => (
                  <motion.li
                    key={idx}
                    layout
                    initial={{ opacity: 0, x: -4 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.26 + idx * 0.04 }}
                    className="flex gap-3 text-gray-700 text-sm"
                  >
                    <span className="text-pink-500 font-bold shrink-0">•</span>
                    <span>{item}</span>
                  </motion.li>
                )
              )}
            </motion.ul>
          </div>
        </motion.div>
      </div>

      <BottomNav />
      <div className="h-24" />
    </motion.div>
  );
}
