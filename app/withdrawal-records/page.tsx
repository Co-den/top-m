"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { ChevronLeft, Search, Loader2 } from "lucide-react";
import axios, { AxiosError } from "axios";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuthStore } from "@/store/authStore";

interface WithdrawalRecord {
  id: string;
  amount: number;
  date: string;
  status: "pending" | "success" | "failed";
  reference: string;
  bankName: string;
  accountNumber: string;
  accountName: string;
  method?: string;
}

export default function WithdrawalRecordsPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();

  const [searchTerm, setSearchTerm] = useState("");
  const [withdrawals, setWithdrawals] = useState<WithdrawalRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("en-NG", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  const fetchUserWithdrawals = useCallback(async () => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;

    if (!isAuthenticated || !token) {
      setError("Session expired. Please login again.");
      setLoading(false);
      router.push("/login");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await axios.get(
        "https://top-mart-api.onrender.com/api/users/user-withdrawals",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      if (response.data?.status === "success") {
        setWithdrawals(response.data.data ?? []);
      } else {
        setError("Unexpected response from server.");
      }
    } catch (err) {
      const error = err as AxiosError<any>;

      console.error("FULL AXIOS ERROR:", error);

      if (error.response) {
        console.error("STATUS:", error.response.status);
        console.error("DATA:", error.response.data);

        setError(JSON.stringify(error.response.data, null, 2));
      } else if (error.request) {
        setError("No response from server. API may be down.");
      } else {
        setError(error.message);
      }
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    if (!isAuthenticated) return;
    fetchUserWithdrawals();
  }, [isAuthenticated, fetchUserWithdrawals]);

  const safe = (value?: string) => value?.toLowerCase() ?? "";
  const query = searchTerm.toLowerCase();

  const filteredWithdrawals = withdrawals.filter(
    (w) =>
      safe(w.reference).includes(query) ||
      safe(w.bankName).includes(query) ||
      safe(w.accountNumber).includes(query) ||
      safe(w.accountName).includes(query)
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "success":
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
    .filter((w) => w.status === "success")
    .reduce((sum, w) => sum + w.amount, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
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
        <h1 className="text-xl font-bold flex-1 text-center">
          Withdrawal Records
        </h1>
        <motion.button
          whileTap={{ scale: 0.95 }}
          className="text-sm font-medium px-4 py-2 hover:bg-pink-600 rounded"
        >
          Records
        </motion.button>
      </motion.div>

      <div className="max-w-md mx-auto px-4 py-6">
        {loading ? (
          <div className="flex flex-col items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-purple-600 mb-3" />
            <p className="text-gray-600">Loading withdrawals...</p>
          </div>
        ) : error ? (
          <Card className="p-8 text-center border-red-200 bg-red-50">
            <p className="text-red-600 font-medium mb-2">
              Error Loading Withdrawals
            </p>
            <p className="text-sm text-red-500 mb-4 whitespace-pre-wrap">
              {error}
            </p>
            <div className="flex justify-center gap-2">
              <Button
                variant="outline"
                onClick={() => window.location.reload()}
              >
                Try Again
              </Button>
              <Button variant="outline" onClick={() => router.push("/profile")}>
                Go Back
              </Button>
            </div>
          </Card>
        ) : (
          <>
            {/* Summary */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <Card className="p-4 bg-purple-50">
                <p className="text-sm text-gray-600">Total Withdrawals</p>
                <p className="text-2xl font-bold text-purple-600">
                  {totalWithdrawals}
                </p>
              </Card>
              <Card className="p-4 bg-red-50">
                <p className="text-sm text-gray-600">Total Amount</p>
                <p className="text-xl font-bold text-red-600">
                  ₦{totalAmount.toLocaleString()}
                </p>
              </Card>
            </div>

            {/* Search */}
            <div className="mb-6 relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <Input
                className="pl-10"
                placeholder="Search withdrawals..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Records */}
            <div className="space-y-3">
              {filteredWithdrawals.length > 0 ? (
                filteredWithdrawals.map((w) => (
                  <Card key={w.id} className="p-4">
                    <div className="flex justify-between mb-3">
                      <div>
                        <p className="font-semibold">{w.reference}</p>
                        <p className="text-sm text-gray-500">{w.bankName}</p>
                        <p className="text-xs text-gray-400">
                          {w.accountName} • {w.accountNumber}
                        </p>
                      </div>
                      <Badge className={getStatusColor(w.status)}>
                        {w.status.toUpperCase()}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">
                        {formatDate(w.date)}
                      </span>
                      <span className="font-bold text-red-600">
                        -₦{w.amount.toLocaleString()}
                      </span>
                    </div>
                  </Card>
                ))
              ) : (
                <Card className="p-8 text-center">
                  <p className="text-gray-500">
                    {searchTerm
                      ? "No matching withdrawals found."
                      : "No withdrawals yet."}
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
