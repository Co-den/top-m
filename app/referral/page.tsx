"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Copy, ArrowLeft } from "lucide-react";
import { BottomNav } from "@/components/bottom-nav";

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
    <div className="min-h-screen flex flex-col bg-[#f7f7f7]">
      {/* HEADER */}
      <div className="w-full flex justify-center py-6">
        <div className="bg-[#e81d78] text-white flex items-center justify-between px-6 py-5 rounded-xl max-w-3xl w-full shadow-lg">
          <button
            onClick={() => router.back()}
            className="text-white flex items-center justify-center w-10 h-10 rounded-full hover:bg-white/20 transition-colors"
          >
            <ArrowLeft size={24} />
          </button>

          <span className="text-[20px] font-semibold flex-1 text-center">
            Share
          </span>

          <div className="w-10" />
        </div>
      </div>

      {/* CONTENT */}
      <div className="flex-1 flex justify-center px-4 pt-8">
        <div className="w-full max-w-3xl bg-white rounded-3xl shadow-lg p-6">
          {/* TITLE */}
          <h2 className="flex items-center gap-3 text-[18px] font-semibold text-gray-800 mb-6">
            <span className="text-pink-600 text-2xl">👥</span>
            Invite Friends
          </h2>

          {/* INVITE CODE */}
          <p className="text-base font-medium text-gray-700 mb-3">
            Your Invite Code
          </p>
          <div className="bg-[#d11667] rounded-2xl flex items-center justify-between px-6 py-4 text-white">
            <span className="text-xl font-bold tracking-wider break-all">
              {inviteCode}
            </span>
            <button
              onClick={() => copy(inviteCode, "code")}
              className="bg-white text-[#d11667] text-base h-10 px-5 rounded-lg font-medium flex items-center gap-2 shadow-sm hover:bg-gray-100 transition-colors"
            >
              <Copy size={18} />
              {copiedCode ? "Copied!" : "Copy"}
            </button>
          </div>

          <div className="border-t border-gray-300 my-6" />

          {/* INVITE LINK */}
          <p className="text-base font-medium text-gray-700 mb-3">
            Your Invite Link
          </p>
          <div className="bg-[#d11667] rounded-2xl flex items-center justify-between px-6 py-4 text-white wrap-break-word">
            <span className="text-base md:text-lg break-all">{inviteLink}</span>
            <button
              onClick={() => copy(inviteLink, "link")}
              className="bg-white text-[#d11667] text-base h-10 px-5 rounded-lg font-medium flex items-center gap-2 shadow-sm hover:bg-gray-100 transition-colors"
            >
              <Copy size={18} />
              {copiedLink ? "Copied!" : "Copy"}
            </button>
          </div>

          <p className="text-center text-gray-500 text-sm mt-6">
            Share your code and earn rewards when friends join!
          </p>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
