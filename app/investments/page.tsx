"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { TrendingUp } from "lucide-react";
import axios from "axios";

interface Plan {
  _id: string;
  name: string;
  dailyReturn: number;
  duration?: number;
}

interface User {
  _id: string;
  name: string;
  email: string;
  phone?: string;
}

interface Investment {
  _id: string;
  userId: string | User;
  planId: string | Plan;
  depositAmount: number;
  investmentStart: string;
  investmentEnd: string;
  status: string;
  dailyReturn: number;
  totalReturn: number;
  totalEarned: number;
  lastCreditedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export default function InvestmentsPage() {
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchInvestments();
  }, []);

  const fetchInvestments = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(
        "https://top-mart-api.onrender.com/api/investments",
        { withCredentials: true }
      );

      if (response.status !== 200) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.data;
      setInvestments(
        Array.isArray(result.investments) ? result.investments : []
      );
    } catch (error) {
      console.error("Error fetching investments:", error);
      setError(
        error instanceof Error ? error.message : "Failed to fetch investments"
      );
      setInvestments([]);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    if (typeof amount !== "number" || isNaN(amount)) return "N0.00";
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "active":
        return "bg-green-500/20 text-green-700";
      case "completed":
        return "bg-blue-500/20 text-blue-700";
      case "cancelled":
        return "bg-red-500/20 text-red-700";
      default:
        return "bg-gray-500/20 text-gray-700";
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return "Invalid Date";
    }
  };

  const getPlanName = (planId: string | Plan) => {
    if (typeof planId === "string") return planId;
    return planId?.name || planId?._id || "N/A";
  };

  const getUserInfo = (userId: string | User) => {
    if (typeof userId === "string") return userId;
    return userId?.name || userId?._id || "N/A";
  };

  const totalInvested = investments.reduce(
    (sum, inv) => sum + (inv.depositAmount || 0),
    0
  );
  const totalEarned = investments.reduce(
    (sum, inv) => sum + (inv.totalEarned || 0),
    0
  );
  const activeCount = investments.filter(
    (inv) => inv.status === "active"
  ).length;

  return (
    <div className="flex-1 flex flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl text-pink-500 font-bold">
            Investments Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            View and manage all investments in the system
          </p>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p className="font-bold">Error</p>
          <p>{error}</p>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 shadow-sm"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Total Investments
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {investments.length}
              </p>
            </div>
            <TrendingUp className="w-8 h-8 text-pink-500" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 shadow-sm"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Active Investments
              </p>
              <p className="text-2xl font-bold text-green-600">{activeCount}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 shadow-sm"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Total Earned
              </p>
              <p className="text-2xl font-bold text-blue-600">
                {formatCurrency(totalEarned)}
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Investments Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">
                  Plan Name
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">
                  User
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">
                  Deposit Amount
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">
                  Daily Return
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">
                  Total Earned
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">
                  Start Date
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">
                  End Date
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan={8}
                    className="px-6 py-8 text-center text-gray-600 dark:text-gray-400"
                  >
                    Loading investments...
                  </td>
                </tr>
              ) : investments.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="px-6 py-8 text-center text-gray-600 dark:text-gray-400"
                  >
                    No investments found
                  </td>
                </tr>
              ) : (
                investments.map((investment) => (
                  <motion.tr
                    key={investment._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                      {getPlanName(investment.planId)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                      {getUserInfo(investment.userId)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                      {formatCurrency(investment.depositAmount)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                      {formatCurrency(investment.dailyReturn)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-white font-semibold">
                      {formatCurrency(investment.totalEarned)}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                          investment.status
                        )}`}
                      >
                        {investment.status || "unknown"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                      {formatDate(investment.investmentStart)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                      {formatDate(investment.investmentEnd)}
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
