// components/SmartAmountSuggestions.tsx
"use client";

import { useState, useEffect } from "react";
import { TrendingUp, Zap, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

interface AmountSuggestion {
  amounts: number[];
  insights: {
    totalDeposits: number;
    averageAmount: number;
    lastDeposit: number;
    recommendation: string;
  };
}

export default function SmartAmountSuggestions({
  onSelect,
}: {
  onSelect: (amount: number) => void;
}) {
  const [suggestions, setSuggestions] = useState<AmountSuggestion | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSuggestions();
  }, []);

  const fetchSuggestions = async () => {
    try {
      const response = await fetch(
        "https://top-mart-api.onrender.com/api/deposits/suggested-amounts",
        {
          method: "GET",
          credentials: "include",
        }
      );

      if (response.ok) {
        const data = await response.json();
        setSuggestions(data);
      } else {
        // Use defaults if API fails
        setSuggestions({
          amounts: [5000, 10000, 20000, 50000],
          insights: {
            totalDeposits: 0,
            averageAmount: 0,
            lastDeposit: 0,
            recommendation: "Popular amounts",
          },
        });
      }
    } catch (error) {
      console.error("Failed to fetch suggestions:", error);
      // Use defaults
      setSuggestions({
        amounts: [5000, 10000, 20000, 50000],
        insights: {
          totalDeposits: 0,
          averageAmount: 0,
          lastDeposit: 0,
          recommendation: "Popular amounts",
        },
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-2xl p-5 mb-6 border border-pink-200">
        <div className="animate-pulse space-y-3">
          <div className="h-4 bg-pink-200 rounded w-1/3"></div>
          <div className="grid grid-cols-2 gap-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-16 bg-pink-200 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!suggestions) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-2xl p-5 mb-6 border-2 border-pink-200"
    >
      <div className="flex items-center gap-2 mb-3">
        <div className="p-2 bg-gradient-to-r from-pink-500 to-purple-600 rounded-lg">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="font-bold text-gray-800">Smart Suggestions</h3>
          <p className="text-xs text-gray-600">
            {suggestions.insights.recommendation}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-3">
        {suggestions.amounts.map((amount, index) => (
          <motion.button
            key={amount}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onSelect(amount)}
            className="p-4 bg-white border-2 border-pink-200 rounded-xl hover:border-pink-500 hover:shadow-lg transition-all group"
          >
            <div className="text-xl font-bold text-gray-800 group-hover:text-pink-600">
              ₦{amount.toLocaleString()}
            </div>
            {index === 1 && suggestions.insights.totalDeposits > 0 && (
              <div className="text-xs text-pink-500 mt-1 flex items-center gap-1 justify-center">
                <TrendingUp className="w-3 h-3" />
                Most used
              </div>
            )}
          </motion.button>
        ))}
      </div>

      {suggestions.insights.averageAmount > 0 && (
        <div className="bg-white/60 backdrop-blur-sm rounded-lg p-3 text-xs text-gray-600">
          <div className="flex items-center justify-between">
            <span>Your average deposit:</span>
            <span className="font-bold text-pink-600">
              ₦{suggestions.insights.averageAmount.toLocaleString()}
            </span>
          </div>
        </div>
      )}
    </motion.div>
  );
}
