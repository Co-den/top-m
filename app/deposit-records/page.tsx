"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeft, Search, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuthStore } from "@/store/authStore";
import axios from "axios";

interface DepositRecord {
  id: string;
  amount: number;
  date: string;
  status:
    | "completed"
    | "pending"
    | "failed"
    | "awaiting_approval"
    | "successful"
    | "rejected";
  reference: string;
  method: string;
}

export default function DepositRecordsPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [deposits, setDeposits] = useState<DepositRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch user's personal deposits from API
  useEffect(() => {
    const fetchUserDeposits = async () => {
      // Check authentication first
      if (!isAuthenticated) {
        setError("Not authenticated. Redirecting to login...");
        setLoading(false);
        setTimeout(() => {
          router.push("/login");
        }, 1500);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Get user token
        const token = localStorage.getItem("token");

        if (!token) {
          setError("Session expired. Please login again.");
          setLoading(false);
          setTimeout(() => {
            router.push("/login");
          }, 1500);
          return;
        }

        // Fetch only the authenticated user's deposits using axios
        const response = await axios.get(
          "https://top-mart-api.onrender.com/api/users/deposits",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
          }
        );

        // Backend returns: { status: "success", data: [...] }
        setDeposits(response.data.data || []);
      } catch (err: any) {
        console.error("Error fetching user deposits:", err);
        console.error("Error response:", err.response?.data);

        // Handle axios errors
        if (err.response) {
          // Server responded with error status
          console.log("Server error status:", err.response.status);
          console.log("Server error data:", err.response.data);

          if (err.response.status === 401) {
            setError("Session expired. Please login again.");
            setTimeout(() => {
              router.push("/login");
            }, 1500);
          } else if (err.response.status === 500) {
            const serverMessage =
              err.response.data?.message || err.response.data?.error;
            setError(
              `Server error: ${serverMessage || "Please check backend logs"}`
            );
          } else {
            setError(err.response.data?.message || "Failed to load deposits");
          }
        } else if (err.request) {
          // Request made but no response
          setError("Network error. Please check your connection.");
        } else {
          // Other errors
          setError(err.message || "Failed to load deposits");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserDeposits();
  }, [isAuthenticated, router]);

  const filteredDeposits = deposits.filter(
    (deposit) =>
      deposit.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
      deposit.method.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
      case "successful":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "awaiting_approval":
        return "bg-blue-100 text-blue-800";
      case "failed":
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const totalDeposits = deposits.length;
  const totalAmount = deposits
    .filter((d) => d.status === "completed" || d.status === "successful")
    .reduce((sum, d) => sum + d.amount, 0);

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
          <h1 className="text-xl font-semibold">Deposit Records</h1>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-6">
        {/* Loading State */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600 mb-3" />
            <p className="text-gray-600">Loading deposits...</p>
          </div>
        ) : error ? (
          /* Error State */
          <Card className="p-8 text-center border-red-200 bg-red-50">
            <p className="text-red-600 font-medium mb-2">
              Error Loading Deposits
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
              <Card className="p-4 bg-blue-50 border-blue-200">
                <div className="text-sm text-gray-600 mb-1">Total Deposits</div>
                <div className="text-2xl font-bold text-blue-600">
                  {totalDeposits}
                </div>
              </Card>
              <Card className="p-4 bg-green-50 border-green-200">
                <div className="text-sm text-gray-600 mb-1">Total Amount</div>
                <div className="text-xl font-bold text-green-600">
                  ₦{totalAmount.toLocaleString()}
                </div>
              </Card>
            </div>

            {/* Search */}
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <Input
                  placeholder="Search by reference or method..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {/* Records List */}
            <div className="space-y-3">
              {filteredDeposits.length > 0 ? (
                filteredDeposits.map((deposit) => (
                  <Card
                    key={deposit.id}
                    className="p-4 border border-gray-200 hover:border-gray-300 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {deposit.reference}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">
                          {deposit.method}
                        </p>
                      </div>
                      <Badge className={getStatusColor(deposit.status)}>
                        {deposit.status.charAt(0).toUpperCase() +
                          deposit.status.slice(1)}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">
                        {deposit.date}
                      </span>
                      <span className="text-lg font-bold text-green-600">
                        +₦{deposit.amount.toLocaleString()}
                      </span>
                    </div>
                  </Card>
                ))
              ) : (
                <Card className="p-8 text-center border-gray-200">
                  <p className="text-gray-500">
                    {searchTerm
                      ? "No matching deposits found"
                      : "No deposits yet"}
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
