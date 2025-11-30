"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, AlertCircle } from "lucide-react";
import { BottomNav } from "@/components/bottom-nav";
import axios from "axios";
import toast from "react-hot-toast";

const PRESET_AMOUNTS = [
  3000, 6000, 10000, 15000, 30000, 50000, 100000, 200000, 300000, 500000,
  700000, 1000000,
];

export default function RechargePage() {
  const router = useRouter();
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState("");

  const activeAmount = customAmount
    ? Number.parseInt(customAmount)
    : selectedAmount;

  const handleRechargeNow = async () => {
    if (!activeAmount || activeAmount < 3000) {
      toast.error("Please select an amount of at least ₦3,000");
      return;
    }

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

      // Redirect with depositId, not amount
      router.push(`/payment-confirmation/${deposit._id}`);
    } catch (err: any) {
      console.error("Deposit init error", err.response?.data || err.message);
      toast.error(err.response?.data?.message || "Failed to initiate deposit");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-[#e81d78] text-white px-5 py-5 flex items-center justify-between">
        <button className="p-2 -ml-2 hover:bg-pink-600 rounded">
          <ChevronLeft size={24} onClick={() => router.push("/home")} />
        </button>
        <h1 className="text-xl font-bold flex-1 text-center">Recharge</h1>
        <button className="text-sm font-medium px-4 py-2 hover:bg-pink-600 rounded">
          Records
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-md mx-auto">
          {/* Select Amount Section */}
          <div className="bg-white rounded-lg p-6 mb-6 shadow-sm">
            <h2 className="text-gray-700 font-semibold mb-4 text-lg">
              Select Amount
            </h2>

            {/* Preset Amount Grid */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              {PRESET_AMOUNTS.map((amount) => (
                <button
                  key={amount}
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
                </button>
              ))}
            </div>

            {/* Custom Amount */}
            <div className="mb-6">
              <p className="text-gray-600 text-sm mb-3">
                Or enter custom amount
              </p>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-pink-500 font-semibold">
                  ₦
                </span>
                <input
                  type="number"
                  value={customAmount}
                  onChange={(e) => {
                    setCustomAmount(e.target.value);
                    setSelectedAmount(null);
                  }}
                  placeholder="Enter amount"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg text-gray-600 placeholder-gray-400 focus:outline-none focus:border-pink-500"
                />
              </div>
            </div>

            {/* Recharge Now Button */}
            <button
              onClick={handleRechargeNow}
              className="w-full bg-pink-500 hover:bg-pink-600 text-white font-bold py-3 rounded-lg transition-colors"
            >
              Recharge Now
            </button>
          </div>

          {/* Important Information Section */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-start gap-3 mb-4">
              <AlertCircle
                size={20}
                className="text-pink-500 shrink-0 mt-0.5"
              />
              <h3 className="font-semibold text-gray-800">
                Important Information
              </h3>
            </div>

            <ul className="space-y-3">
              <li className="flex gap-3 text-gray-700 text-sm">
                <span className="text-pink-500 font-bold shrink-0">•</span>
                <span>Minimum Recharge Amount: ₦3000</span>
              </li>
              <li className="flex gap-3 text-gray-700 text-sm">
                <span className="text-pink-500 font-bold shrink-0">•</span>
                <span>Payment channels are open 24 hours a day</span>
              </li>
              <li className="flex gap-3 text-gray-700 text-sm">
                <span className="text-pink-500 font-bold shrink-0">•</span>
                <span>
                  For security, payment via APP is the only payment method
                </span>
              </li>
              <li className="flex gap-3 text-gray-700 text-sm">
                <span className="text-pink-500 font-bold shrink-0">•</span>
                <span>
                  Complete payment within 5 minutes or refresh to try again
                </span>
              </li>
              <li className="flex gap-3 text-gray-700 text-sm">
                <span className="text-pink-500 font-bold shrink-0">•</span>
                <span>
                  Keep proof of payment and contact customer service if needed
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <BottomNav />
    </div>
  );
}
