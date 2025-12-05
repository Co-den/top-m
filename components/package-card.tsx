import { TrendingUp, BarChart3, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface PackageCardProps {
  id: string;
  name: string;
  cycleDays: string | number;
  price: number;
  dailyReturn: number;
  totalReturn: number;
}

export default function PackageCard({
  id,
  name,
  cycleDays,
  price,
  dailyReturn,
  totalReturn,
}: PackageCardProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const formatCurrency = (value: number) => {
    return `₦${value.toLocaleString()}`;
  };

  const handleBuyPlan = async () => {
  try {
    setLoading(true);
    const response = await fetch(
      "https://top-mart-api.onrender.com/api/plans/buy",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ planId: id }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      alert(data.message || "Insufficient funds for this plan");
      return;
    }

    alert("Plan purchased successfully!");
    router.push("/investments");
  } catch (err) {
    console.error("Error buying plan:", err);
    alert("Something went wrong while purchasing the plan");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="w-full max-w-sm rounded-2xl overflow-hidden shadow-lg bg-white">
      {/* Gradient Header */}
      <div className="bg-linear-to-r from-blue-500 via-purple-500 to-pink-500 px-6 py-6">
        <h2 className="text-2xl font-bold text-white">{name}</h2>
        <p className="text-blue-100 text-sm">Cycle: {cycleDays} Days</p>
      </div>

      {/* Content Section */}
      <div className="p-6 space-y-6">
        {/* Price Details */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-pink-100">
              <Wallet className="w-5 h-5 text-pink-500" strokeWidth={2.5} />
            </div>
            <span className="text-gray-700 font-semibold text-lg">
              {formatCurrency(price)}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-pink-100">
              <TrendingUp className="w-5 h-5 text-pink-500" strokeWidth={2.5} />
            </div>
            <span className="text-gray-700 text-sm">
              Daily: {formatCurrency(dailyReturn)}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-pink-100">
              <BarChart3 className="w-5 h-5 text-pink-500" strokeWidth={2.5} />
            </div>
            <span className="text-gray-700 text-sm">
              Total: {formatCurrency(totalReturn)}
            </span>
          </div>
        </div>

        {/* Logo Section */}
        <div className="flex items-center justify-end">
          <div className="w-16 h-16 rounded-lg bg-yellow-100 flex items-center justify-center">
            <div className="text-center">
              <div className="text-xs font-bold text-gray-800">Top</div>
              <div className="text-xs font-bold text-gray-800">Market</div>
            </div>
          </div>
        </div>

        {/* Invest Now Button */}
        <Button
          disabled={loading}
          className="w-full bg-linear-to-r from-pink-500 to-blue-500 hover:from-pink-600 hover:to-blue-600 text-white font-semibold py-6 rounded-lg text-base border-none"
          onClick={handleBuyPlan}
        >
          {loading ? "Processing..." : "Invest Now"}
        </Button>
      </div>
    </div>
  );
}
