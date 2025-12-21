"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, AlertCircle } from "lucide-react";
import { BottomNav } from "@/components/bottom-nav";
import axios from "axios";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import SmartAmountSuggestions from "@/components/smartAmountSuggestions";

const PRESET_AMOUNTS = [
  3000, 6000, 10000, 15000, 30000, 50000, 100000, 200000, 300000, 500000,
  700000, 1000000,
];

export default function RechargePage() {
  const router = useRouter();
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState("");
  const [loading, setLoading] = useState(false);

  const activeAmount = customAmount
    ? Number.parseInt(customAmount)
    : selectedAmount;

  const handleRechargeNow = async () => {
    if (!activeAmount || activeAmount < 3000) {
      toast.error("Please select an amount of at least ₦3,000");
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        "https://top-mart-api.onrender.com/api/deposits/initiate",
        { amount: activeAmount },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const { deposit } = res.data;
      router.push(`/payment-confirmation/${deposit._id}`);
    } catch (err: any) {
      console.error("Deposit init error", err.response?.data || err.message);
      toast.error(err.response?.data?.message || "Failed to initiate deposit");
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
      className="min-h-screen bg-gray-50 flex flex-col"
    >
      {/* Header */}
      <motion.div
        initial={{ y: -6, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="bg-[#e81d78] text-white px-5 py-5 flex items-center justify-between"
      >
        <motion.button
          whileTap={{ scale: 0.95 }}
          whileHover={{ scale: 1.05 }}
          className="p-2 -ml-2 hover:bg-pink-600 rounded"
          onClick={() => router.push("/home")}
        >
          <ChevronLeft size={24} />
        </motion.button>
        <h1 className="text-xl font-bold flex-1 text-center">Recharge</h1>
        <motion.button
          whileTap={{ scale: 0.95 }}
          className="text-sm font-medium px-4 py-2 hover:bg-pink-600 rounded"
        >
          Records
        </motion.button>
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-md mx-auto">
          {/* ✅ ADD SMART SUGGESTIONS HERE - BEFORE "Select Amount" */}
          <SmartAmountSuggestions
            onSelect={(amount) => {
              setSelectedAmount(amount);
              setCustomAmount(amount.toString());
            }}
          />

          {/* Select Amount Section */}
          <motion.div
            layout
            initial={{ opacity: 0, scale: 0.995 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.32 }}
            className="bg-white rounded-lg p-6 mb-6 shadow-sm"
          >
            <motion.h2
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.04 }}
              className="text-gray-700 font-semibold mb-4 text-lg"
            >
              Select Amount
            </motion.h2>

            {/* Preset Amount Grid */}
            <motion.div
              layout
              className="grid grid-cols-3 gap-3 mb-6"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.06, staggerChildren: 0.04 }}
            >
              {PRESET_AMOUNTS.map((amount, idx) => (
                <motion.button
                  key={amount}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.02 }}
                  whileTap={{ scale: 0.96 }}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => {
                    setSelectedAmount(amount);
                    setCustomAmount(String(amount));
                  }}
                  className={`py-3 px-2 rounded-lg font-semibold text-sm transition-colors ${
                    selectedAmount === amount
                      ? "bg-pink-500 text-white"
                      : "bg-gray-100 text-pink-500 hover:bg-gray-200"
                  }`}
                >
                  ₦{amount.toLocaleString()}
                </motion.button>
              ))}
            </motion.div>

            {/* Custom Amount */}
            <motion.div
              layout
              className="mb-6"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 }}
            >
              <p className="text-gray-600 text-sm mb-3">
                Or enter custom amount
              </p>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-pink-500 font-semibold">
                  ₦
                </span>
                <motion.input
                  type="number"
                  value={customAmount}
                  onChange={(e) => {
                    setCustomAmount(e.target.value);
                    setSelectedAmount(null);
                  }}
                  placeholder="Enter amount"
                  whileFocus={{ scale: 1.01 }}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg text-gray-600 placeholder-gray-400 focus:outline-none focus:border-pink-500"
                />
              </div>
            </motion.div>

            {/* Recharge Now Button */}
            <motion.button
              onClick={handleRechargeNow}
              disabled={loading}
              whileTap={{ scale: 0.98 }}
              whileHover={{ scale: 1.02 }}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="w-full bg-pink-500 hover:bg-pink-600 text-white font-bold py-3 rounded-lg transition-colors disabled:opacity-60"
            >
              {loading ? "Processing..." : "Recharge Now"}
            </motion.button>
          </motion.div>

          {/* Important Information Section */}
          <motion.div
            layout
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12, duration: 0.32 }}
            className="bg-white rounded-lg p-6 shadow-sm"
          >
            <div className="flex items-start gap-3 mb-4">
              <motion.div
                whileTap={{ scale: 0.95 }}
                whileHover={{ scale: 1.05 }}
              >
                <AlertCircle
                  size={20}
                  className="text-pink-500 shrink-0 mt-0.5"
                />
              </motion.div>
              <motion.h3
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.14 }}
                className="font-semibold text-gray-800"
              >
                Important Information
              </motion.h3>
            </div>

            <motion.ul
              className="space-y-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.16, staggerChildren: 0.04 }}
            >
              {[
                "Minimum Recharge Amount: ₦3000",
                "Payment channels are open 24 hours a day",
                "For security, payment via APP is the only payment method",
                "Complete payment within 5 minutes or refresh to try again",
                "Keep proof of payment and contact customer service if needed",
              ].map((item, idx) => (
                <motion.li
                  key={idx}
                  layout
                  initial={{ opacity: 0, x: -4 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.16 + idx * 0.04 }}
                  className="flex gap-3 text-gray-700 text-sm"
                >
                  <span className="text-pink-500 font-bold shrink-0">•</span>
                  <span>{item}</span>
                </motion.li>
              ))}
            </motion.ul>
          </motion.div>
        </div>
      </div>
      <BottomNav />
    </motion.div>
  );
}
