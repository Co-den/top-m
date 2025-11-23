"use client";

import { useState } from "react";
import { ArrowLeft, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { BottomNav } from "@/components/bottom-nav";

export default function WithdrawPage() {
  const [withdrawAmount, setWithdrawAmount] = useState("");

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-pink-600 text-white px-4 py-6 flex items-center justify-between">
        <Link href="/products" className="flex items-center">
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <h1 className="text-xl font-bold">Withdraw</h1>
        <Link href="#" className="text-sm font-medium">
          Records
        </Link>
      </div>

      {/* Main Content */}
      <div className="px-4 py-6 max-w-2xl mx-auto">
        {/* Balance Card */}
        <div className="bg-pink-600 text-white rounded-2xl p-6 mb-6">
          <p className="text-sm font-medium mb-2">My Balance</p>
          <h2 className="text-4xl font-bold">₦1,100</h2>
        </div>

        {/* Account Details */}
        <div className="bg-white rounded-lg p-6 mb-6 border border-gray-200">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-6 h-6 bg-pink-600 rounded-lg flex items-center justify-center text-white text-xs">
              🏦
            </div>
            <h3 className="text-lg font-bold text-pink-600">
              My Account Details
            </h3>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-600 font-medium">
                Account Name:
              </label>
              <p className="text-gray-800 font-medium">
                IKENNA NZUBECHI AGUGBUE
              </p>
            </div>
            <div>
              <label className="text-sm text-gray-600 font-medium">
                Account Number:
              </label>
              <p className="text-gray-800 font-medium">9136651670</p>
            </div>
            <div>
              <label className="text-sm text-gray-600 font-medium">
                Bank Name:
              </label>
              <p className="text-gray-800 font-medium">Opay</p>
            </div>
          </div>
        </div>

        {/* Withdrawal Amount */}
        <div className="bg-white rounded-lg p-6 border border-gray-200 mb-6">
          <h3 className="text-lg font-bold mb-4">Withdrawal Amount</h3>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">
              ₦
            </span>
            <input
              type="text"
              placeholder="Enter withdrawal amount"
              value={withdrawAmount}
              onChange={(e) => setWithdrawAmount(e.target.value)}
              className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-600 placeholder-gray-400"
            />
          </div>
        </div>

        {/* Withdraw Button */}
        <Button className="w-full bg-pink-600 hover:bg-pink-700 text-white py-3 rounded-lg font-bold text-lg">
          Withdraw Funds
        </Button>
      </div>

      {/* Bottom Navigation */}
     <BottomNav />
      <div className="h-24" />
    </div>
  );
}
