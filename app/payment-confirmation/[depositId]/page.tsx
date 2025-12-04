"use client";

import React from "react";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { ArrowLeft, Copy, CheckCircle } from "lucide-react";
import Link from "next/link";
import { BottomNav } from "@/components/bottom-nav";
import axios from "axios";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

export default function PaymentConfirmationPage() {
  const { depositId } = useParams<{ depositId: string }>();

  const [deposit, setDeposit] = useState<any>(null);
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [senderName, setSenderName] = useState("");
  const [minutes, setMinutes] = useState(10);
  const [seconds, setSeconds] = useState(0);
  const [loading, setLoading] = useState(false);

  const amount = deposit?.amount || 0;
  const user = deposit?.user;

  useEffect(() => {
    const fetchDeposit = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `https://top-mart-api.onrender.com/api/deposits/${depositId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setDeposit(res.data.deposit);
      } catch (err) {
        console.error("Failed to fetch deposit", err);
      }
    };
    fetchDeposit();
  }, [depositId]);

  // countdown
  useEffect(() => {
    let timeLeft = 600;
    const interval = setInterval(() => {
      timeLeft -= 1;
      setMinutes(Math.floor(timeLeft / 60));
      setSeconds(timeLeft % 60);
      if (timeLeft <= 0) clearInterval(interval);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${type} copied to clipboard`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !senderName) {
      toast.error("Please upload proof and enter sender name");
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("file", file);
      formData.append("senderName", senderName);

      await axios.post(
        `https://top-mart-api.onrender.com/api/deposits/${depositId}/proof`,
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success("Proof submitted successfully!");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to submit proof");
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setFileName(selectedFile.name);
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
      {/* Pink Header */}
      <motion.div
        initial={{ y: -6, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="bg-pink-500 text-white p-6 flex items-center justify-center relative"
      >
        <Link
          href="/recharge"
          className="absolute left-4 text-white hover:text-pink-100 transition"
        >
          <motion.div whileTap={{ scale: 0.95 }} whileHover={{ scale: 1.05 }}>
            <ArrowLeft className="w-6 h-6" />
          </motion.div>
        </Link>
        <h1 className="text-xl font-bold">Payment Confirmation</h1>
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto pb-32">
        <div className="max-w-2xl mx-auto w-full px-4 py-6 space-y-6">
          {/* Amount Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.995 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.32 }}
            className="bg-pink-500 text-white rounded-lg p-8 text-center shadow-sm"
          >
            <motion.div
              initial={{ y: 6, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.06 }}
              className="text-5xl font-bold mb-2"
            >
              ₦{deposit ? deposit.amount.toLocaleString() : "0"}
            </motion.div>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="text-pink-100 mb-1"
            >
              Use this account for this transaction only!
            </motion.p>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.12 }}
              className="text-pink-100"
            >
              Account expires in {minutes}:{seconds.toString().padStart(2, "0")}
            </motion.p>
          </motion.div>

          {/* Payment Details Card */}
          <motion.div
            layout
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08, duration: 0.32 }}
            className="bg-white rounded-lg shadow-sm p-6 space-y-6 border border-gray-200"
          >
            {/* Name Field */}
            <motion.div
              layout
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <label className="block text-sm text-gray-700 mb-1">Name:</label>
              <div className="text-gray-900">
                {user?.bankAccount?.accountName ?? "Not set"}
              </div>
            </motion.div>

            {/* Bank Field */}
            <motion.div
              layout
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.02 }}
            >
              <label className="block text-sm text-gray-700 mb-1">Bank:</label>
              <div className="text-gray-900">
                {user?.bankAccount?.bankName ?? "Not set"}
              </div>
            </motion.div>

            {/* Account Number Field */}
            <motion.div
              layout
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.04 }}
            >
              <label className="block text-sm text-gray-700 mb-1">
                Account Number:
              </label>
              <div className="flex items-center justify-between">
                <span className="text-gray-900">
                  {user?.bankAccount?.accountNumber ?? "Not set"}
                </span>
                <motion.button
                  onClick={() =>
                    handleCopy(
                      user?.bankAccount?.accountNumber ?? "",
                      "account"
                    )
                  }
                  whileTap={{ scale: 0.95 }}
                  whileHover={{ scale: 1.05 }}
                  className="text-pink-500 hover:text-pink-600 transition"
                >
                  <Copy className="w-5 h-5" />
                </motion.button>
              </div>
            </motion.div>

            {/* Amount Field */}
            <motion.div
              layout
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.06 }}
            >
              <label className="block text-sm text-gray-700 mb-1">
                Amount:
              </label>
              <div className="flex items-center justify-between">
                <span className="text-gray-900 font-semibold">{amount}</span>
                <motion.button
                  onClick={() => handleCopy(amount, "amount")}
                  whileTap={{ scale: 0.95 }}
                  whileHover={{ scale: 1.05 }}
                  className="text-pink-500 hover:text-pink-600 transition"
                >
                  <Copy className="w-5 h-5" />
                </motion.button>
              </div>
            </motion.div>

            {/* Expiry Alert */}
            <motion.div
              layout
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 }}
              className="bg-pink-50 border border-pink-200 rounded p-4 text-center"
            >
              <p className="text-pink-600 text-sm font-medium">
                Please note that payment expires in {minutes}:
                {seconds.toString().padStart(2, "0")}
              </p>
            </motion.div>
          </motion.div>

          {/* Deposit Confirmation Section */}
          <motion.div
            layout
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.32 }}
            className="bg-white rounded-lg shadow-sm p-6 border border-gray-200"
          >
            {/* Section Header */}
            <div className="flex items-center gap-3 mb-6">
              <motion.div whileTap={{ scale: 0.95 }} whileHover={{ scale: 1.05 }}>
                <CheckCircle className="w-6 h-6 text-pink-500" />
              </motion.div>
              <h2 className="text-lg font-semibold text-gray-900">
                Deposit Confirmation
              </h2>
            </div>

            {/* Instructions */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.12 }}
              className="text-pink-600 text-sm font-medium mb-6"
            >
              Kindly submit payment proof and payer name below!
            </motion.p>

            {/* Form */}
            <motion.form
              onSubmit={handleSubmit}
              className="space-y-4"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.14 }}
            >
              {/* File Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Proof
                </label>
                <div className="relative">
                  <input
                    type="file"
                    id="file-upload"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <motion.label
                    htmlFor="file-upload"
                    whileTap={{ scale: 0.98 }}
                    whileHover={{ scale: 1.01 }}
                    className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded cursor-pointer hover:bg-gray-50 transition"
                  >
                    <span className="text-gray-700 font-medium">
                      Choose File
                    </span>
                  </motion.label>
                  <AnimatePresence>
                    {fileName ? (
                      <motion.span
                        initial={{ opacity: 0, x: -4 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -4 }}
                        className="ml-3 text-gray-600 text-sm"
                      >
                        {fileName}
                      </motion.span>
                    ) : (
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="ml-3 text-gray-400 text-sm"
                      >
                        No file chosen
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Sender Name */}
              <motion.input
                type="text"
                placeholder="Enter sender name"
                value={senderName}
                onChange={(e) => setSenderName(e.target.value)}
                whileFocus={{ scale: 1.01 }}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              />

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={loading}
                whileTap={{ scale: 0.98 }}
                whileHover={{ scale: 1.02 }}
                className="w-full bg-pink-500 hover:bg-pink-600 text-white font-semibold py-3 rounded-lg transition duration-200 mt-6 disabled:opacity-60"
              >
                {loading ? "Submitting..." : "Submit"}
              </motion.button>
            </motion.form>
          </motion.div>
        </div>
      </div>
      <BottomNav />
    </motion.div>
  );
}
