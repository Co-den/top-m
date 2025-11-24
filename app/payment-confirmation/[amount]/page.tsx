"use client";

import React from "react";
import { useState, useEffect } from "react";
import { ArrowLeft, Copy, CheckCircle } from "lucide-react";
import Link from "next/link";
import { BottomNav } from "@/components/bottom-nav";
import axios from "axios";
import toast from "react-hot-toast";

export default function PaymentConfirmationPage({
  params,
}: {
  params: Promise<{ amount: string }>;
}) {
  const { amount } = React.use(params);
  const formattedAmount = `₦${amount}`;

  const [user, setUser] = useState<any>(null);
  const [timeLeft, setTimeLeft] = useState(600);
  const [fileName, setFileName] = useState<string | null>(null);
  const [senderName, setSenderName] = useState("");
  const [copiedField, setCopiedField] = useState<string | null>(null);

  

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
  // Countdown timer
  useEffect(() => {
    if (timeLeft <= 0) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timeLeft]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
    toast.success(
      `${field === "amount" ? "Amount" : "Account number"} copied!`
    );
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFileName(e.target.files[0].name);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitting:", { fileName, senderName });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Pink Header */}
      <div className="bg-pink-500 text-white p-6 flex items-center justify-center relative">
        <Link
          href="/recharge"
          className="absolute left-4 text-white hover:text-pink-100 transition"
        >
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <h1 className="text-xl font-bold">Payment Confirmation</h1>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto pb-32">
        <div className="max-w-2xl mx-auto w-full px-4 py-6 space-y-6">
          {/* Amount Card */}
          <div className="bg-pink-500 text-white rounded-lg p-8 text-center shadow-sm">
            <div className="text-5xl font-bold mb-2">{formattedAmount}</div>
            <p className="text-pink-100 mb-1">
              Use this account for this transaction only!
            </p>
            <p className="text-pink-100">
              Account expires in {minutes}:{seconds.toString().padStart(2, "0")}
            </p>
          </div>

          {/* Payment Details Card */}
          <div className="bg-white rounded-lg shadow-sm p-6 space-y-6 border border-gray-200">
            {/* Name Field */}
            <div>
              <label className="block text-sm text-gray-700 mb-1">Name:</label>
              <div className="text-gray-900">
                {user?.bankAccount?.accountName ?? "Not set"}
              </div>
            </div>

            {/* Bank Field */}
            <div>
              <label className="block text-sm text-gray-700 mb-1">Bank:</label>
              <div className="text-gray-900">
                {user?.bankAccount?.bankName ?? "Not set"}
              </div>
            </div>

            {/* Account Number Field */}
            <div>
              <label className="block text-sm text-gray-700 mb-1">
                Account Number:
              </label>
              <div className="flex items-center justify-between">
                <span className="text-gray-900">
                  {user?.bankAccount?.accountNumber ?? "Not set"}
                </span>
                <button
                  onClick={() =>
                    handleCopy(
                      user?.bankAccount?.accountNumber ?? "",
                      "account"
                    )
                  }
                  className="text-pink-500 hover:text-pink-600 transition"
                >
                  <Copy className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Amount Field */}
            <div>
              <label className="block text-sm text-gray-700 mb-1">
                Amount:
              </label>
              <div className="flex items-center justify-between">
                <span className="text-gray-900 font-semibold">{amount}</span>
                <button
                  onClick={() => handleCopy(amount, "amount")}
                  className="text-pink-500 hover:text-pink-600 transition"
                >
                  <Copy className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Expiry Alert */}
            <div className="bg-pink-50 border border-pink-200 rounded p-4 text-center">
              <p className="text-pink-600 text-sm font-medium">
                Please note that payment expires in {minutes}:
                {seconds.toString().padStart(2, "0")}
              </p>
            </div>
          </div>

          {/* Deposit Confirmation Section */}
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            {/* Section Header */}
            <div className="flex items-center gap-3 mb-6">
              <CheckCircle className="w-6 h-6 text-pink-500" />
              <h2 className="text-lg font-semibold text-gray-900">
                Deposit Confirmation
              </h2>
            </div>

            {/* Instructions */}
            <p className="text-pink-600 text-sm font-medium mb-6">
              Kindly submit payment proof and payer name below!
            </p>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
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
                  <label
                    htmlFor="file-upload"
                    className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded cursor-pointer hover:bg-gray-50 transition"
                  >
                    <span className="text-gray-700 font-medium">
                      Choose File
                    </span>
                  </label>
                  {fileName && (
                    <span className="ml-3 text-gray-600 text-sm">
                      {fileName}
                    </span>
                  )}
                  {!fileName && (
                    <span className="ml-3 text-gray-400 text-sm">
                      No file chosen
                    </span>
                  )}
                </div>
              </div>

              {/* Sender Name */}
              <div>
                <input
                  type="text"
                  placeholder="Enter sender name"
                  value={senderName}
                  onChange={(e) => setSenderName(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-pink-500 hover:bg-pink-600 text-white font-semibold py-3 rounded-lg transition duration-200 mt-6"
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      </div>
      <BottomNav />
    </div>
  );
}
