"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Copy, ArrowLeft } from "lucide-react";
import { BottomNav } from "@/components/bottom-nav";
import { motion, AnimatePresence } from "framer-motion";

export default function SharePage() {
  const router = useRouter();

  const inviteCode = "UDOET4";
  const inviteLink = `https://top-mart.shop/register?ref=${inviteCode}`;

  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

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

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.36, ease: "easeOut" }}
      className="min-h-screen flex flex-col bg-[#f7f7f7]"
    >
      {/* HEADER */}
      <motion.div
        initial={{ y: -6, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.28 }}
        className="w-full flex justify-center py-6"
      >
        <div className="bg-[#e81d78] text-white flex items-center justify-between px-6 py-5 rounded-xl max-w-3xl w-full shadow-lg">
          <motion.button
            onClick={() => router.back()}
            whileTap={{ scale: 0.95 }}
            className="text-white flex items-center justify-center w-10 h-10 rounded-full hover:bg-white/20 transition-colors"
          >
            <ArrowLeft size={24} />
          </motion.button>

          <motion.span
            initial={{ scale: 0.995 }}
            animate={{ scale: 1 }}
            className="text-[20px] font-semibold flex-1 text-center"
          >
            Share
          </motion.span>

          <div className="w-10" />
        </div>
      </motion.div>

      {/* CONTENT */}
      <motion.main
        layout
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.32 }}
        className="flex-1 flex justify-center px-4 pt-8"
      >
        <motion.div
          layout
          initial={{ scale: 0.995, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 24 }}
          className="w-full max-w-3xl bg-white rounded-3xl shadow-lg p-6"
        >
          {/* TITLE */}
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
            className="bg-[#d11667] rounded-2xl flex items-center justify-between px-6 py-4 text-white"
          >
            <motion.span
              layout
              className="text-xl font-bold tracking-wider break-all"
            >
              {inviteCode}
            </motion.span>

            <div className="flex items-center gap-3">
              <motion.button
                onClick={() => copy(inviteCode, "code")}
                whileTap={{ scale: 0.96 }}
                whileHover={{ scale: 1.02 }}
                className="bg-white text-[#d11667] text-base h-10 px-5 rounded-lg font-medium flex items-center gap-2 shadow-sm hover:bg-gray-100 transition-colors"
              >
                <Copy size={18} />
                {copiedCode ? "Copied!" : "Copy"}
              </motion.button>
            </div>
          </motion.div>

          <div className="border-t border-gray-300 my-6" />

          {/* INVITE LINK */}
          <motion.p className="text-base font-medium text-gray-700 mb-3">
            Your Invite Link
          </motion.p>

          <motion.div
            layout
            className="bg-[#d11667] rounded-2xl flex items-center justify-between px-6 py-4 text-white break-words"
          >
            <motion.span layout className="text-base md:text-lg break-all">
              {inviteLink}
            </motion.span>

            <div className="flex items-center gap-3">
              <motion.button
                onClick={() => copy(inviteLink, "link")}
                whileTap={{ scale: 0.96 }}
                whileHover={{ scale: 1.02 }}
                className="bg-white text-[#d11667] text-base h-10 px-5 rounded-lg font-medium flex items-center gap-2 shadow-sm hover:bg-gray-100 transition-colors"
              >
                <Copy size={18} />
                {copiedLink ? "Copied!" : "Copy"}
              </motion.button>
            </div>
          </motion.div>

          <AnimatePresence>
            {(copiedCode || copiedLink) && (
              <motion.p
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.18 }}
                className="text-center text-gray-500 text-sm mt-6"
              >
                {copiedCode ? "Invite code copied to clipboard" : ""}
                {copiedLink ? "Invite link copied to clipboard" : ""}
              </motion.p>
            )}
          </AnimatePresence>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.06 }}
            className="text-center text-gray-500 text-sm mt-6"
          >
            Share your code and earn rewards when friends join!
          </motion.p>
        </motion.div>
      </motion.main>

      <BottomNav />
    </motion.div>
  );
}
