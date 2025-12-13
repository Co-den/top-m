"use client";

import { BottomNav } from "@/components/bottom-nav";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ChevronLeft } from "lucide-react";

export default function ProductsPage() {
  const router = useRouter();
  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <div className="max-w-md mx-auto">
        <div className="bg-pink-500 text-white p-6 flex justify-center">
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
              Products
            </h1>
          </motion.div>
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
  );
}
