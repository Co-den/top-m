"use client";

import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { BottomNav } from "@/components/bottom-nav";

export default function UpdateBankPage() {
  const [selectedBank, setSelectedBank] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [accountName, setAccountName] = useState("");

  const banks = [
    "Select Bank",
    "GTBank",
    "Access Bank",
    "Zenith Bank",
    "First Bank",
    "UBA",
    "Opay",
    "Moniepoint",
  ];

  const handleSubmit = () => {
    console.log({
      bank: selectedBank,
      accountNumber,
      accountName,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-pink-600 text-white px-4 py-6 flex items-center">
        <Link href="/withdraw" className="flex items-center">
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <h1 className="text-xl font-bold flex-1 text-center">Update Bank</h1>
      </div>

      {/* Main Content */}
      <div className="px-4 py-6 max-w-2xl mx-auto">
        <div className="bg-white rounded-lg p-6 border border-gray-200 space-y-5">
          {/* Bank Selection */}
          <div>
            <label htmlFor="bank-select" className="sr-only">
              Select Bank
            </label>
            <select
              id="bank-select"
              value={selectedBank}
              onChange={(e) => setSelectedBank(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-600 text-gray-700 bg-white cursor-pointer"
            >
              {banks.map((bank) => (
                <option key={bank} value={bank}>
                  {bank}
                </option>
              ))}
            </select>
          </div>

          {/* Account Number */}
          <div>
            <input
              type="text"
              placeholder="Please enter your account number"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-600 placeholder-gray-400"
            />
          </div>

          {/* Account Name */}
          <div>
            <input
              type="text"
              placeholder="Account Name"
              value={accountName}
              onChange={(e) => setAccountName(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-600 placeholder-gray-400"
            />
          </div>

          {/* Submit Button */}
          <Button
            onClick={handleSubmit}
            className="w-full bg-pink-600 hover:bg-pink-700 text-white py-3 rounded-lg font-bold text-lg mt-6"
          >
            Submit
          </Button>
        </div>
      </div>

      <BottomNav />

      {/* Spacer for bottom nav */}
      <div className="h-24" />
    </div>
  );
}
