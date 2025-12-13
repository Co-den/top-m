"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Copy, ArrowLeft, Users, TrendingUp, Award, ChevronLeft } from "lucide-react";
import { BottomNav } from "@/components/bottom-nav";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

interface ReferralInfo {
  referralCode: string;
  referralLink: string;
  totalReferrals: number;
  referralBonus: number;
  totalEarnings: number;
}

interface ReferredUser {
  _id: string;
  fullName: string;
  email: string;
  createdAt: string;
}

export default function SharePage() {
  const router = useRouter();
  const [referralInfo, setReferralInfo] = useState<ReferralInfo | null>(null);
  const [referredUsers, setReferredUsers] = useState<ReferredUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    fetchReferralInfo();
  }, []);

  const fetchReferralInfo = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      const response = await axios.get(
        "https://top-mart-api.onrender.com/api/referrals/my-referrals",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      if (response.data.success) {
        setReferralInfo(response.data.referralInfo);
        setReferredUsers(response.data.referredUsers || []);
      }
    } catch (error) {
      console.error("Error fetching referral info:", error);
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          setError("Session expired. Please login again.");
          setTimeout(() => router.push("/login"), 2000);
        } else {
          setError(
            error.response?.data?.message || "Failed to fetch referral info"
          );
        }
      } else {
        setError("An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  const copy = (text: string, target: "code" | "link") => {
    navigator.clipboard.writeText(text);
    if (target === "code") {
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 1500);
    } else {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 1500);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f7f7f7]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading referral info...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f7f7f7]">
        <div className="text-center p-6">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-red-500 text-2xl">✕</span>
          </div>
          <p className="text-gray-800 font-semibold mb-2">Oops!</p>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchReferralInfo}
            className="bg-pink-500 text-white px-6 py-2 rounded-lg hover:bg-pink-600 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!referralInfo) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f7f7f7]">
        <div className="text-center p-6">
          <p className="text-gray-600 mb-4">
            No referral information available
          </p>
          <button
            onClick={fetchReferralInfo}
            className="bg-pink-500 text-white px-6 py-2 rounded-lg hover:bg-pink-600 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.36, ease: "easeOut" }}
      className="min-h-screen flex flex-col bg-[#f7f7f7]"
    >
      {/* HEADER */}
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
        <h1 className="text-xl font-bold flex-1 text-center">Share & Earn</h1>
      </motion.div>

      {/* CONTENT */}
      <motion.main
        layout
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.32 }}
        className="flex-1 flex flex-col items-center px-4 pt-4 pb-24 overflow-y-auto"
      >
        {/* Stats Cards */}
        <div className="w-full max-w-3xl grid grid-cols-3 gap-3 mb-6">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl p-4 shadow-sm text-center"
          >
            <Users className="w-6 h-6 text-blue-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-800">
              {referralInfo.totalReferrals}
            </p>
            <p className="text-xs text-gray-500">Referrals</p>
          </motion.div>

          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.15 }}
            className="bg-white rounded-2xl p-4 shadow-sm text-center"
          >
            <TrendingUp className="w-6 h-6 text-green-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-800">
              ₦{referralInfo.referralBonus.toLocaleString()}
            </p>
            <p className="text-xs text-gray-500">Bonus</p>
          </motion.div>

          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl p-4 shadow-sm text-center"
          >
            <Award className="w-6 h-6 text-yellow-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-800">
              ₦{referralInfo.totalEarnings.toLocaleString()}
            </p>
            <p className="text-xs text-gray-500">Total Earned</p>
          </motion.div>
        </div>

        {/* Referral Code Card */}
        <motion.div
          layout
          initial={{ scale: 0.995, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 24 }}
          className="w-full max-w-3xl bg-white rounded-3xl shadow-lg p-6 mb-6"
        >
          <motion.h2
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.02 }}
            className="flex items-center gap-3 text-[18px] font-semibold text-gray-800 mb-6"
          >
            <span className="text-pink-600 text-2xl">👥</span>
            Invite Friends
          </motion.h2>

          {/* INVITE CODE */}
          <motion.p className="text-base font-medium text-gray-700 mb-3">
            Your Invite Code
          </motion.p>

          <motion.div
            layout
            className="bg-[#d11667] rounded-2xl flex items-center justify-between px-6 py-4 text-white mb-6"
          >
            <motion.span
              layout
              className="text-xl font-bold tracking-wider break-all"
            >
              {referralInfo.referralCode}
            </motion.span>

            <motion.button
              onClick={() => copy(referralInfo.referralCode, "code")}
              whileTap={{ scale: 0.96 }}
              whileHover={{ scale: 1.02 }}
              className="bg-white text-[#d11667] text-base h-10 px-5 rounded-lg font-medium flex items-center gap-2 shadow-sm hover:bg-gray-100 transition-colors ml-3"
            >
              <Copy size={18} />
              {copiedCode ? "Copied!" : "Copy"}
            </motion.button>
          </motion.div>

          {/* INVITE LINK */}
          <motion.p className="text-base font-medium text-gray-700 mb-3">
            Your Invite Link
          </motion.p>

          <motion.div
            layout
            className="bg-[#d11667] rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between px-6 py-4 text-white gap-3"
          >
            <motion.span
              layout
              className="text-sm md:text-base break-all flex-1"
            >
              {referralInfo.referralLink}
            </motion.span>

            <motion.button
              onClick={() => copy(referralInfo.referralLink, "link")}
              whileTap={{ scale: 0.96 }}
              whileHover={{ scale: 1.02 }}
              className="bg-white text-[#d11667] text-base h-10 px-5 rounded-lg font-medium flex items-center gap-2 shadow-sm hover:bg-gray-100 transition-colors whitespace-nowrap"
            >
              <Copy size={18} />
              {copiedLink ? "Copied!" : "Copy"}
            </motion.button>
          </motion.div>

          <AnimatePresence>
            {(copiedCode || copiedLink) && (
              <motion.p
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.18 }}
                className="text-center text-green-600 text-sm mt-4 font-medium"
              >
                ✓ {copiedCode ? "Code" : "Link"} copied to clipboard!
              </motion.p>
            )}
          </AnimatePresence>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.06 }}
            className="text-center text-gray-500 text-sm mt-6"
          >
            Share your code and earn ₦1,000 bonus when friends join!
          </motion.p>
        </motion.div>

        {/* Referred Users List */}
        {referredUsers.length > 0 && (
          <motion.div
            initial={{ scale: 0.995, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="w-full max-w-3xl bg-white rounded-3xl shadow-lg p-6"
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Your Referrals ({referredUsers.length})
            </h3>
            <div className="space-y-3">
              {referredUsers.map((user, index) => (
                <motion.div
                  key={user._id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-xl"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center">
                      <span className="text-pink-600 font-semibold">
                        {user.fullName.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">
                        {user.fullName}
                      </p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">
                      {formatDate(user.createdAt)}
                    </p>
                    <p className="text-sm font-semibold text-green-600">
                      +₦1,000
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </motion.main>

      <BottomNav />
    </motion.div>
  );
}
