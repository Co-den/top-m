"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { BottomNav } from "@/components/bottom-nav";
import { Wallet, Gift, Share2, Banknote } from "lucide-react";
import { useRouter } from "next/navigation";
import PackageCard from "@/components/package-card";
import { apiRequest } from "@/lib/api";

export default function MainHomePage() {
  const router = useRouter();
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    apiRequest("https://top-mart-api.onrender.com/api/products")
      .then((data) => {
        setProducts(Array.isArray(data?.products) ? data.products : []);
      })
      .catch((err) => {
        console.error("Failed to load products:", err);
        setProducts([]);
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
    <div className="min-h-screen bg-[#f5f5f5] pb-24 flex flex-col items-center">
      {/* Container for content */}
      <div className="w-full max-w-3xl">
        {/* BANNER */}
        <div className="mt-6 mx-4">
          <Image
            src="/banner.jpg"
            alt="Banner"
            width={800}
            height={432}
            className="w-full rounded-2xl object-cover"
          />
        </div>

        {/* QUICK ACTIONS */}
        <div className="bg-white shadow-lg rounded-2xl mx-4 mt-6 p-5 flex justify-between">
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
            label="invite"
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
        </div>

        {/* PACKAGES - mapped using PackageCard pattern */}
        <div className="mt-6 mx-4 grid grid-cols-1 md:grid-cols-2 gap-5">
          {products.length === 0
            ? null
            : products.map((p: any) => (
                <PackageCard
                  key={p.name ?? p.id}
                  name={String(p.name ?? "Package")}
                  cycleDays={p.cycleDays ?? ""}
                  price={parseNumber(p.price)}
                  dailyReturn={parseNumber(p.dailyReturn)}
                  totalReturn={parseNumber(p.totalReturn)}
                />
              ))}
        </div>
      </div>

      <BottomNav />
    </div>
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
    <button onClick={onClick} className="flex flex-col items-center space-y-2">
      <div
        className={`p-4 rounded-full flex items-center justify-center ${bgClass} ${textClass}`}
      >
        {icon}
      </div>
      <span className="text-sm text-black font-medium">{label}</span>
    </button>
  );
}
