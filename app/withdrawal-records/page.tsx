"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft, Search, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface WithdrawalRecord {
  id: string;
  amount: number;
  date: string;
  status: "completed" | "pending" | "failed";
  reference: string;
  bankAccount: string;
}

export default function WithdrawalRecordsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [withdrawals, setWithdrawals] = useState<WithdrawalRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch user's personal withdrawals from API
  useEffect(() => {
    const fetchUserWithdrawals = async () => {
      try {
        setLoading(true);
        setError(null);

        // Get user token from your auth system
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("Not authenticated. Please login.");
        }

        // Fetch only the authenticated user's withdrawals
        const response = await fetch(
          "https://top-mart-api.onrender.com/api/user/withdrawals",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status === 401) {
          throw new Error("Session expired. Please login again.");
        }

        if (!response.ok) {
          throw new Error(
            `Failed to fetch withdrawals: ${response.statusText}`
          );
        }

        const data = await response.json();

        // Adjust based on your API response structure
        // API should return only withdrawals for the authenticated user
        setWithdrawals(data.withdrawals || data);
      } catch (err) {
        console.error("Error fetching user withdrawals:", err);
        setError(
          err instanceof Error ? err.message : "Failed to load withdrawals"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchUserWithdrawals();
  }, []);

  const filteredWithdrawals = withdrawals.filter(
    (withdrawal) =>
      withdrawal.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
      withdrawal.bankAccount.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "failed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const totalWithdrawals = withdrawals.length;
  const totalAmount = withdrawals
    .filter((w) => w.status === "completed")
    .reduce((sum, w) => sum + w.amount, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-4 py-4">
        <div className="max-w-md mx-auto flex items-center gap-3">
          <Link href="/profile">
            <Button variant="ghost" size="icon">
              <ChevronLeft className="h-6 w-6" />
            </Button>
          </Link>
          <h1 className="text-xl font-semibold">Withdrawal Records</h1>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-6">
        {/* Loading State */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-purple-600 mb-3" />
            <p className="text-gray-600">Loading withdrawals...</p>
          </div>
        ) : error ? (
          /* Error State */
          <Card className="p-8 text-center border-red-200 bg-red-50">
            <p className="text-red-600 font-medium mb-2">
              Error Loading Withdrawals
            </p>
            <p className="text-sm text-red-500 mb-4">{error}</p>
            <Button
              onClick={() => window.location.reload()}
              variant="outline"
              className="border-red-300 text-red-600 hover:bg-red-100"
            >
              Try Again
            </Button>
          </Card>
        ) : (
          <>
            {/* Summary Cards */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <Card className="p-4 bg-purple-50 border-purple-200">
                <div className="text-sm text-gray-600 mb-1">
                  Total Withdrawals
                </div>
                <div className="text-2xl font-bold text-purple-600">
                  {totalWithdrawals}
                </div>
              </Card>
              <Card className="p-4 bg-red-50 border-red-200">
                <div className="text-sm text-gray-600 mb-1">Total Amount</div>
                <div className="text-xl font-bold text-red-600">
                  ₦{totalAmount.toLocaleString()}
                </div>
              </Card>
            </div>

            {/* Search */}
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <Input
                  placeholder="Search by reference or bank..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {/* Records List */}
            <div className="space-y-3">
              {filteredWithdrawals.length > 0 ? (
                filteredWithdrawals.map((withdrawal) => (
                  <Card
                    key={withdrawal.id}
                    className="p-4 border border-gray-200 hover:border-gray-300 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {withdrawal.reference}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">
                          {withdrawal.bankAccount}
                        </p>
                      </div>
                      <Badge className={getStatusColor(withdrawal.status)}>
                        {withdrawal.status.charAt(0).toUpperCase() +
                          withdrawal.status.slice(1)}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">
                        {withdrawal.date}
                      </span>
                      <span className="text-lg font-bold text-red-600">
                        -₦{withdrawal.amount.toLocaleString()}
                      </span>
                    </div>
                  </Card>
                ))
              ) : (
                <Card className="p-8 text-center border-gray-200">
                  <p className="text-gray-500">
                    {searchTerm
                      ? "No matching withdrawals found"
                      : "No withdrawals yet"}
                  </p>
                </Card>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
