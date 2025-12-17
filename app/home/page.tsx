"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { BottomNav } from "@/components/bottom-nav";
import { Wallet, Gift, Share2, Banknote } from "lucide-react";
import { useRouter } from "next/navigation";
import PackageCard from "@/components/package-card";
import { apiRequest } from "@/lib/api";
import { motion, AnimatePresence } from "framer-motion";
import { getPlanSuggestion } from "@/utils/germinipage";
import FloatingAIButton from "@/components/floating-button";

interface Plan {
  _id: string;
  id?: string;
  name: string;
  cycleDays: string | number;
  price: string | number;
  dailyReturn: string | number;
  totalReturn: string | number;
}

export default function MainHomePage() {
  const router = useRouter();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [aiSuggestions, setAiSuggestions] = useState<Record<string, string>>(
    {}
  );
  const [loadingSuggestions, setLoadingSuggestions] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    let isMounted = true;

    const fetchPlansAndSuggestions = async () => {
      if (!isMounted) return;

      setIsLoading(true);
      setError("");

      try {
        const data = await apiRequest(
          "https://top-mart-api.onrender.com/api/plans",
          {
            requireAuth: false,
          }
        ).catch((err) => {
          console.error("API Request failed:", err);
          throw new Error(err?.message || "Failed to fetch plans");
        });

        if (!isMounted) return;

        const fetchedPlans: Plan[] = Array.isArray(data?.plans)
          ? data.plans
          : [];
        setPlans(fetchedPlans);
        setIsLoading(false);

        if (fetchedPlans.length > 0 && isMounted) {
          fetchAISuggestions(fetchedPlans).catch((err) => {
            console.error("AI suggestions failed:", err);
          });
        }
      } catch (err: any) {
        console.error("Failed to load plans:", err);
        if (isMounted) {
          setError(err?.message || "Failed to load plans");
          setPlans([]);
          setIsLoading(false);
        }
      }
    };

    fetchPlansAndSuggestions().catch((err) => {
      console.error("Unhandled error:", err);
      if (isMounted) {
        setError("An unexpected error occurred");
        setIsLoading(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  const fetchAISuggestions = async (plansList: Plan[]): Promise<void> => {
    setLoadingSuggestions(true);

    try {
      const initialSuggestions: Record<string, string> = {};
      plansList.forEach((plan) => {
        initialSuggestions[plan._id] = "Loading...";
      });
      setAiSuggestions(initialSuggestions);

      for (const plan of plansList) {
        try {
          const suggestionText = await getPlanSuggestion(plan.name).catch(
            () => {
              return "AI suggestion unavailable";
            }
          );

          setAiSuggestions((prev) => ({
            ...prev,
            [plan._id]: suggestionText || "AI suggestion unavailable",
          }));
        } catch (error: any) {
          console.error("Error:", error);
          setAiSuggestions((prev) => ({
            ...prev,
            [plan._id]: "AI suggestion unavailable",
          }));
        }
      }
    } catch (error: any) {
      console.error("Error fetching AI suggestions:", error);
    } finally {
      setLoadingSuggestions(false);
    }
  };

  const parseNumber = (
    v: string | number | undefined,
    fallback = 0
  ): number => {
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
      <FloatingAIButton plans={plans} />
      <div className="w-full max-w-3xl">
        <motion.div
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
              priority
            />
          </div>
        </motion.div>

        <motion.div
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

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mx-4 mt-6 bg-red-50 border border-red-200 rounded-xl p-4"
          >
            <div className="flex items-center gap-2">
              <span className="text-red-600 text-xl">⚠️</span>
              <div>
                <h3 className="font-semibold text-red-800">
                  Error Loading Plans
                </h3>
                <p className="text-sm text-red-600">{error}</p>
              </div>
            </div>
          </motion.div>
        )}

        <section className="mt-6 mx-4 grid grid-cols-1 md:grid-cols-2 gap-5">
          <AnimatePresence mode="wait">
            {isLoading ? (
              Array.from({ length: 4 }).map((_, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white rounded-2xl p-6 shadow-lg animate-pulse"
                >
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-4" />
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-3" />
                  <div className="h-4 bg-gray-200 rounded w-2/3 mb-3" />
                  <div className="h-10 bg-gray-200 rounded w-full mt-4" />
                </motion.div>
              ))
            ) : plans.length === 0 && !error ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="col-span-full text-center py-12"
              >
                <div className="text-6xl mb-4">📦</div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  No Plans Available
                </h3>
                <p className="text-gray-500">
                  Check back later for new investment plans.
                </p>
              </motion.div>
            ) : (
              plans.map((p, index) => (
                <motion.div
                  key={p._id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.28, delay: index * 0.05 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <PackageCard
                    planId={String(p._id)}
                    name={String(p.name)}
                    cycleDays={p.cycleDays}
                    price={parseNumber(p.price)}
                    dailyReturn={parseNumber(p.dailyReturn)}
                    totalReturn={parseNumber(p.totalReturn)}
                  />
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </section>
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
      aria-label={label}
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
