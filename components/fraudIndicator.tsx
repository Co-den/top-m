"use client";

import {
  AlertTriangle,
  Shield,
  AlertCircle,
  Info,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

interface FraudFlag {
  type: string;
  severity: string;
  message: string;
  relatedDeposit?: string;
}

interface FraudAnalysis {
  riskScore: number;
  riskLevel: "LOW" | "MEDIUM" | "HIGH";
  flags: FraudFlag[];
  recommendation: string;
  analyzedAt?: string;
}

export function FraudRiskIndicator({ analysis }: { analysis: FraudAnalysis }) {
  const [expanded, setExpanded] = useState(false);

  const getRiskColor = (level: string) => {
    switch (level) {
      case "HIGH":
        return {
          bg: "bg-red-50",
          border: "border-red-300",
          text: "text-red-700",
          accent: "bg-red-500",
        };
      case "MEDIUM":
        return {
          bg: "bg-yellow-50",
          border: "border-yellow-300",
          text: "text-yellow-700",
          accent: "bg-yellow-500",
        };
      default:
        return {
          bg: "bg-green-50",
          border: "border-green-300",
          text: "text-green-700",
          accent: "bg-green-500",
        };
    }
  };

  const getRiskIcon = (level: string) => {
    switch (level) {
      case "HIGH":
        return <AlertTriangle className="w-5 h-5" />;
      case "MEDIUM":
        return <AlertCircle className="w-5 h-5" />;
      default:
        return <Shield className="w-5 h-5" />;
    }
  };

  const colors = getRiskColor(analysis.riskLevel);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`rounded-xl border-2 p-4 ${colors.bg} ${colors.border}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 flex-1">
          <div className={`p-2 ${colors.accent} rounded-lg text-white`}>
            {getRiskIcon(analysis.riskLevel)}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className={`font-bold text-sm ${colors.text}`}>
                {analysis.riskLevel} RISK
              </span>
              <span className={`text-xs ${colors.text} opacity-75`}>
                ({analysis.riskScore}/100)
              </span>
            </div>
            <div className="w-full bg-white/50 rounded-full h-2 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${analysis.riskScore}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className={`h-full ${colors.accent}`}
              />
            </div>
          </div>
        </div>

        {analysis.flags.length > 0 && (
          <button
            onClick={() => setExpanded(!expanded)}
            className={`p-1 hover:bg-black/5 rounded transition ${colors.text}`}
          >
            {expanded ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>
        )}
      </div>

      <AnimatePresence>
        {expanded && analysis.flags.length > 0 && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="mt-3 space-y-2 overflow-hidden"
          >
            {analysis.flags.map((flag, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                className={`flex items-start gap-2 text-xs ${colors.text} bg-white/50 p-2 rounded-lg`}
              >
                <Info className="w-3 h-3 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <div className="font-medium">{flag.message}</div>
                  <div className="text-xs opacity-75 mt-0.5">
                    {flag.severity} severity
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <div
        className={`mt-3 pt-3 border-t ${colors.border} flex items-center justify-between`}
      >
        <span className={`text-xs font-semibold ${colors.text}`}>
          Recommendation: {analysis.recommendation}
        </span>
        {analysis.analyzedAt && (
          <span className={`text-xs ${colors.text} opacity-60`}>
            {new Date(analysis.analyzedAt).toLocaleTimeString()}
          </span>
        )}
      </div>
    </motion.div>
  );
}

// Simple badge for table rows
export function FraudRiskBadge({ riskLevel }: { riskLevel: string }) {
  if (riskLevel === "LOW") return null;

  const colors = {
    HIGH: "bg-red-100 text-red-700 border-red-300",
    MEDIUM: "bg-yellow-100 text-yellow-700 border-yellow-300",
  };

  return (
    <span
      className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full border ${
        colors[riskLevel as keyof typeof colors]
      }`}
    >
      <AlertTriangle className="w-3 h-3" />
      {riskLevel}
    </span>
  );
}

// Compact indicator for notification dropdown
export function FraudRiskDot({ riskLevel }: { riskLevel: string }) {
  if (riskLevel === "LOW") return null;

  const colors = {
    HIGH: "bg-red-500",
    MEDIUM: "bg-yellow-500",
  };

  return (
    <span
      className={`inline-block w-2 h-2 rounded-full ${
        colors[riskLevel as keyof typeof colors]
      }`}
      title={`${riskLevel} risk`}
    />
  );
}
