"use client"

import { BottomNav } from "@/components/bottom-nav"
import { motion } from "framer-motion"

export default function ProductsPage() {
  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <div className="max-w-md mx-auto">
        <div className="bg-pink-500 text-white p-6 flex justify-center">
          <motion.h1
            className="text-2xl font-bold"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Products
          </motion.h1>
        </div>

        <div className="p-4">
          <motion.div
            className="bg-white rounded-lg shadow p-6 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <p className="text-slate-600">Products coming soon...</p>
          </motion.div>
        </div>
      </div>

      <BottomNav />
    </div>
  )
}
