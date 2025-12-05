"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { BottomNav } from "@/components/bottom-nav";
import { Wallet, Gift, Share2, Banknote } from "lucide-react";
import { useRouter } from "next/navigation";
import PackageCard from "@/components/package-card";
import { apiRequest } from "@/lib/api";
import { motion, AnimatePresence } from "framer-motion";

export default function MainHomePage() {
  const router = useRouter();
  const [plans, setPlans] = useState<any[]>([]);

  useEffect(() => {
    apiRequest("https://top-mart-api.onrender.com/api/plans")
      .then((data) => {
        setPlans(Array.isArray(data?.plans) ? data.plans : []);
      })
      .catch((err) => {
        console.error("Failed to load plans:", err);
        setPlans([]);
      });
  }, []);

  const parseNumber = (v: string | number | undefined, fallback = 0) => {
    if (typeof v === "number") return v;
    if (typeof v === "string") {
      const cleaned = v.replace(/[^0-9.\-]+/g, "");
      const n = parseFloat(cleaned);
      return Number.isFinite(n) ? n : fallback;
    }
    return fallback;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="min-h-screen bg-[#f5f5f5] pb-24 flex flex-col items-center"
    >
      {/* Container for content */}
      <div className="w-full max-w-3xl">
        {/* BANNER */}
        <motion.div
          layout
          initial={{ opacity: 0, scale: 0.995 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.45 }}
          className="mt-6 mx-4"
        >
          <div className="w-full rounded-2xl overflow-hidden">
            <Image
              src="/banner.jpg"
              alt="Banner"
              width={800}
              height={432}
              className="w-full rounded-2xl object-cover"
            />
          </div>
        </motion.div>

        {/* QUICK ACTIONS */}
        <motion.div
          layout
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05, duration: 0.32 }}
          className="bg-white shadow-lg rounded-2xl mx-4 mt-6 p-5 flex justify-between"
        >
          <QuickAction
            icon={<Wallet size={22} />}
            label="Recharge"
            onClick={() => router.push("/recharge")}
            bgClass="bg-pink-100"
            textClass="text-pink-600"
          />
          <QuickAction
            icon={<Gift size={22} />}
            label="Gift Code"
            onClick={() => router.push("/giftcode")}
            bgClass="bg-purple-100"
            textClass="text-purple-600"
          />
          <QuickAction
            icon={<Share2 size={22} />}
            label="Invite"
            onClick={() => router.push("/referral")}
            bgClass="bg-purple-100"
            textClass="text-purple-600"
          />
          <QuickAction
            icon={<Banknote size={22} />}
            label="Withdraw"
            onClick={() => router.push("/withdraw")}
            bgClass="bg-yellow-100"
            textClass="text-yellow-600"
          />
        </motion.div>

        {/* PACKAGES - mapped using PackageCard pattern */}
        <motion.section className="mt-6 mx-4 grid grid-cols-1 md:grid-cols-2 gap-5">
          <AnimatePresence>
            {plans.length === 0
              ? null
              : plans.map((p: any) => (
                  <motion.div
                    key={p._id ?? p.id ?? p.name}
                    layout
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.28 }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <PackageCard
                      id={String(p._id ?? p.id ?? "")}
                      name={String(p.name ?? "Package")}
                      cycleDays={p.cycleDays ?? ""}
                      price={parseNumber(p.price)}
                      dailyReturn={parseNumber(p.dailyReturn)}
                      totalReturn={parseNumber(p.totalReturn)}
                    />
                  </motion.div>
                ))}
          </AnimatePresence>
        </motion.section>
      </div>

      <BottomNav />
    </motion.div>
  );
}

function QuickAction({
  icon,
  label,
  onClick,
  bgClass = "bg-pink-100",
  textClass = "text-pink-600",
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  bgClass?: string;
  textClass?: string;
}) {
  return (
    <motion.button
      onClick={onClick}
      whileTap={{ scale: 0.96 }}
      whileHover={{ scale: 1.02 }}
      className="flex flex-col items-center space-y-2"
    >
      <div
        className={`p-4 rounded-full flex items-center justify-center ${bgClass} ${textClass}`}
      >
        {icon}
      </div>
      <span className="text-sm text-black font-medium">{label}</span>
    </motion.button>
  );
}
