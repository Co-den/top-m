"use client";

import { useState, useEffect } from "react";
import { Shield, AlertTriangle, TrendingUp, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

interface FraudStats {
  highRisk: number;
  mediumRisk: number;
  recentFlags: any[];
}

export default function FraudStatsWidget() {
  const [stats, setStats] = useState<FraudStats>({
    highRisk: 0,
    mediumRisk: 0,
    recentFlags: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
    // Refresh every minute
    const interval = setInterval(fetchStats, 60000);
    return () => clearInterval(interval);
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch(
        "https://top-mart-api.onrender.com/api/deposits/fraud-stats",
        {
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error("Failed to fetch fraud stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const totalRisky = stats.highRisk + stats.mediumRisk;

  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-border p-6 shadow-sm">
        <div className="flex items-center justify-center h-32">
          <Loader2 className="w-8 h-8 animate-spin text-pink-500" />
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl border border-border p-4 md:p-6 shadow-sm"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 md:p-3 bg-red-50 rounded-lg">
          <Shield className="w-5 h-5 md:w-6 md:h-6 text-red-500" />
        </div>
        <div>
          <h3 className="font-bold text-gray-800 text-sm md:text-base">
            Fraud Detection
          </h3>
          <p className="text-xs text-gray-600">Security monitoring</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 md:gap-4 mb-4">
        <div className="bg-red-50 rounded-lg p-3 md:p-4 border border-red-200">
          <div className="flex items-center gap-2 mb-1">
            <AlertTriangle className="w-3 h-3 md:w-4 md:h-4 text-red-600" />
            <span className="text-xs font-medium text-red-600">High Risk</span>
          </div>
          <div className="text-xl md:text-2xl font-bold text-red-700">
            {stats.highRisk}
          </div>
        </div>

        <div className="bg-yellow-50 rounded-lg p-3 md:p-4 border border-yellow-200">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="w-3 h-3 md:w-4 md:h-4 text-yellow-600" />
            <span className="text-xs font-medium text-yellow-600">
              Medium Risk
            </span>
          </div>
          <div className="text-xl md:text-2xl font-bold text-yellow-700">
            {stats.mediumRisk}
          </div>
        </div>
      </div>

      {totalRisky > 0 ? (
        <div className="bg-red-50 rounded-lg p-3 text-center border border-red-200">
          <p className="text-sm text-red-800">
            <span className="font-bold text-red-600">{totalRisky}</span> deposit
            {totalRisky !== 1 ? "s" : ""} need review
          </p>
        </div>
      ) : (
        <div className="bg-green-50 rounded-lg p-3 text-center border border-green-200">
          <p className="text-sm text-green-800 font-medium">
            ✓ No high-risk deposits
          </p>
        </div>
      )}
    </motion.div>
  );
}
