"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { TrendingUp } from "lucide-react";

interface Investment {
  _id: string;
  userId: string;
  planId: string;
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

  useEffect(() => {
    fetchInvestments();
  }, []);

  const fetchInvestments = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        "https://top-mart-api.onrender.com/api/investments",
        { credentials: "include" }
      );
      if (response.ok) {
        const result = await response.json();
        setInvestments(result.investments ?? []);
      }
    } catch (error) {
      console.error("Error fetching investments:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
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

  return (
    <div className="flex-1 flex flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl text-pink-500 font-bold">
            Investments Management
          </h1>
          <p className="text-foreground/60">
            View and manage all investments in the system
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-lg border border-border p-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-foreground/60">Total Investments</p>
              <p className="text-2xl font-bold text-foreground">
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
          className="bg-card rounded-lg border border-border p-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-foreground/60">Active Investments</p>
              <p className="text-2xl font-bold text-green-600">
                {investments.filter((inv) => inv.status === "active").length}
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card rounded-lg border border-border p-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-foreground/60">Total Earned</p>
              <p className="text-2xl font-bold text-blue-600">
                {formatCurrency(
                  investments.reduce((sum, inv) => sum + inv.totalEarned, 0)
                )}
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Investments Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card rounded-lg border border-border overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted border-b border-border">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                  Plan ID
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                  Deposit Amount
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                  Daily Return
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                  Total Earned
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                  Start Date
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                  End Date
                </th>
              </tr>
            </thead>
            <tbody>
              {investments.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-8 text-center text-foreground/60"
                  >
                    {loading ? "Loading..." : "No investments found"}
                  </td>
                </tr>
              ) : (
                investments.map((investment) => (
                  <motion.tr
                    key={investment._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="border-b border-border hover:bg-muted/50 transition-colors"
                  >
                    <td className="px-6 py-4 text-sm font-medium text-foreground">
                      {investment.planId}
                    </td>
                    <td className="px-6 py-4 text-sm text-foreground">
                      {formatCurrency(investment.depositAmount)}
                    </td>
                    <td className="px-6 py-4 text-sm text-foreground">
                      {formatCurrency(investment.dailyReturn)}
                    </td>
                    <td className="px-6 py-4 text-sm text-foreground font-semibold">
                      {formatCurrency(investment.totalEarned)}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                          investment.status
                        )}`}
                      >
                        {investment.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-foreground">
                      {investment.investmentStart
                        ? new Date(
                            investment.investmentStart
                          ).toLocaleDateString()
                        : "N/A"}
                    </td>
                    <td className="px-6 py-4 text-sm text-foreground">
                      {investment.investmentEnd
                        ? new Date(
                            investment.investmentEnd
                          ).toLocaleDateString()
                        : "N/A"}
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
