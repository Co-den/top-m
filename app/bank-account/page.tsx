"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { BottomNav } from "@/components/bottom-nav";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

export default function UpdateBankPage() {
  const [banks, setBanks] = useState<{ name: string; code: string }[]>([]);
  const [selectedBank, setSelectedBank] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [accountName, setAccountName] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchBanks = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          "https://top-mart-api.onrender.com/api/bank/banks",
          {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          }
        );
        setBanks(res.data.banks);
      } catch (err) {
        console.error("Failed to fetch banks", err);
      }
    };
    fetchBanks();
  }, []);

  // 🔹 Resolve account name in real-time
  const handleResolveAccount = async () => {
    if (!selectedBank || accountNumber.length !== 10) return;
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const res = await axios.post(
        "https://top-mart-api.onrender.com/api/bank/bank-account",
        {
          bankCode: selectedBank,
          accountNumber,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );

      setAccountName(res.data.accountName);
    } catch (err: any) {
      setAccountName("Unable to resolve account");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Save bank details to backend
  const handleSaveBank = async () => {
    if (!selectedBank || !accountNumber || !accountName) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const res = await axios.post(
        "https://top-mart-api.onrender.com/api/bank/update-account",
        {
          bankName: banks.find((b) => b.code === selectedBank)?.name,
          accountNumber,
          accountName,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );

      toast.success(res.data.message ?? "Bank details updated successfully");
      
    } catch (err: any) {
      const msg = err?.response?.data?.message ?? "Failed to update bank details";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="min-h-screen bg-gray-50"
    >
      {/* Header */}
      <motion.div
        initial={{ y: -6 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-pink-600 text-white px-4 py-6 flex items-center"
      >
        <Link href="/profile" className="flex items-center">
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <h1 className="text-xl font-bold flex-1 text-center">Update Bank</h1>
      </motion.div>

      {/* Main Content */}
      <div className="px-4 py-6 max-w-2xl mx-auto">
        <motion.div
          layout
          initial={{ scale: 0.995, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 280, damping: 24 }}
          className="bg-white rounded-lg p-6 border border-gray-200 space-y-5"
        >
          {/* Bank Selection */}
          <motion.div layout initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
            <select
              id="bank-select"
              value={selectedBank}
              onChange={(e) => setSelectedBank(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-600 text-gray-700 bg-white cursor-pointer"
            >
              <option value="">Select Bank</option>
              {banks.map((bank, index) => (
                <option key={`${bank.code}-${index}`} value={bank.code}>
                  {bank.name}
                </option>
              ))}
            </select>
          </motion.div>

          {/* Account Number */}
          <motion.div layout initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
            <input
              type="text"
              placeholder="Enter account number"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
              onBlur={handleResolveAccount} // resolves when user leaves input
              className="border p-2 w-full mb-4"
              maxLength={10}
            />
          </motion.div>

          {/* Account Name */}
          <motion.div layout initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
            <input
              type="text"
              placeholder="Account Name"
              value={accountName}
              readOnly
              className="border p-2 w-full mb-4 bg-gray-100"
            />
          </motion.div>

          {/* Submit Button */}
          <motion.div layout initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
            <motion.button
              onClick={handleSaveBank}
              disabled={loading}
              whileTap={{ scale: 0.98 }}
              whileHover={{ scale: 1.02 }}
              className="w-full bg-pink-600 hover:bg-pink-700 text-white py-6 rounded-lg font-bold text-lg mt-6 disabled:opacity-60"
            >
              {loading ? "Saving..." : "Save Bank Details"}
            </motion.button>
          </motion.div>
        </motion.div>
      </div>

      <BottomNav />
      <div className="h-24" />
    </motion.div>
  );
}
