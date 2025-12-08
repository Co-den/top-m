"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CreatePlanModal } from "@/components/create-plan-modal";

interface Plan {
  _id: string;
  name: string;
  cycleDays: number;
  price: number;
  dailyReturn: number;
  totalReturn: number;
  image: string;
  createdAt: string;
  updatedAt: string;
}

export default function PlansPage() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        "https://top-mart-api.onrender.com/api/plans",
        { credentials: "include" }
      );
      if (response.ok) {
        const result = await response.json();
        setPlans(result.products ?? []);
      }
    } catch (error) {
      console.error("Error fetching plans:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePlan = async (
    planData: Omit<Plan, "_id" | "createdAt">
  ) => {
    try {
      const response = await fetch(
        "https://top-mart-api.onrender.com/admin/plans",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(planData),
        }
      );
      if (response.ok) {
        const newPlan = await response.json();
        setPlans([...plans, newPlan]);
        setIsCreateModalOpen(false);
      }
    } catch (error) {
      console.error("Error creating plan:", error);
    }
  };

  const handleDeletePlan = async (planId: string) => {
    try {
      const response = await fetch(
        `https://top-mart-api.onrender.com/admin/plans/${planId}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );
      if (response.ok) {
        setPlans(plans.filter((p) => p._id !== planId));
      }
    } catch (error) {
      console.error("Error deleting plan:", error);
    }
  };

  return (
    <div className="flex-1 flex flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl text-pink-500 font-bold">
            Plans Management
          </h1>
          <p className="text-foreground/60">
            Create and manage investment plans
          </p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)} className="gap-2 bg-pink-500">
          <Plus className="h-4 w-4" />
          Create Plan
        </Button>
      </div>

      {/* Plans Grid */}
      {loading ? (
        <div className="text-center py-12 text-foreground/60">Loading...</div>
      ) : plans.length === 0 ? (
        <div className="text-center py-12 text-foreground/60">
          No plans created yet
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <motion.div
              key={plan._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-shadow"
            >
              <h3 className="text-xl font-bold text-foreground mb-2">
                {plan.name}
              </h3>
              <p className="text-foreground/60 text-sm mb-4">
                {plan.cycleDays} days cycle
              </p>

              <div className="mb-4">
                <p className="text-3xl font-bold text-primary mb-2">
                  ${plan.price}
                </p>
                <p className="text-sm text-foreground/60">Daily Cycle: {plan.dailyReturn}</p>
              </div>

              <div className="mb-6">
                <p className="text-sm font-semibold text-foreground mb-2">
                  Total Return: {plan.totalReturn}
                </p>
              </div>

              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleDeletePlan(plan._id)}
                className="w-full gap-2"
              >
                <Trash2 className="h-4 w-4" />
                Delete Plan
              </Button>
            </motion.div>
          ))}
        </div>
      )}

      {/* Create Plan Modal */}
      <CreatePlanModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreate={handleCreatePlan}
      />
    </div>
  );
}
