"use client"

import { motion } from "framer-motion"
import { TrendingUp } from "lucide-react"

export default function InvestmentsPage() {
  return (
    <div className="flex-1 flex flex-col gap-6 p-6">
      <div>
        <h1 className="text-3xl text-pink-500 font-bold">Investments</h1>
        <p className="text-foreground/60">Track all user investments and returns</p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card border border-border rounded-lg p-12 flex flex-col items-center justify-center text-center"
      >
        <TrendingUp className="h-16 w-16 text-primary/40 mb-4" />
        <h2 className="text-2xl font-bold text-foreground mb-2">Coming Soon</h2>
        <p className="text-foreground/60">Investment tracking features will be available soon</p>
      </motion.div>
    </div>
  )
}
