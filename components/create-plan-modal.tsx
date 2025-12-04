"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CreatePlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (plan: any) => void;
}

export function CreatePlanModal({ isOpen, onClose, onCreate }: CreatePlanModalProps) {
  const [name, setName] = useState("");
  const [cycleDays, setCycleDays] = useState("");
  const [price, setPrice] = useState("");
  const [dailyReturn, setDailyReturn] = useState("");
  const [totalReturn, setTotalReturn] = useState("");
  const [image, setImage] = useState("");

  const handleSubmit = () => {
    if (name && cycleDays && price && dailyReturn && totalReturn) {
      onCreate({
        name,
        cycleDays: Number.parseInt(cycleDays),
        price: Number.parseFloat(price),
        dailyReturn: Number.parseFloat(dailyReturn),
        totalReturn: Number.parseFloat(totalReturn),
        image,
      });
      // reset form
      setName("");
      setCycleDays("");
      setPrice("");
      setDailyReturn("");
      setTotalReturn("");
      setImage("");
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-card border border-border rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="text-xl font-bold text-foreground">Create New Plan</h2>
              <button
                onClick={onClose}
                className="text-foreground/60 hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Form */}
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Plan Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., VIP Plan"
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Cycle Days
                </label>
                <input
                  type="number"
                  value={cycleDays}
                  onChange={(e) => setCycleDays(e.target.value)}
                  placeholder="30"
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Price ($)
                </label>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="0"
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Daily Return
                </label>
                <input
                  type="number"
                  value={dailyReturn}
                  onChange={(e) => setDailyReturn(e.target.value)}
                  placeholder="e.g., 500"
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Total Return
                </label>
                <input
                  type="number"
                  value={totalReturn}
                  onChange={(e) => setTotalReturn(e.target.value)}
                  placeholder="e.g., 15000"
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Image URL
                </label>
                <input
                  type="text"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  placeholder="http://..."
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground text-sm"
                />
              </div>
            </div>

            {/* Footer */}
            <div className="flex gap-3 p-6 border-t border-border">
              <Button
                variant="outline"
                onClick={onClose}
                className="flex-1 bg-transparent"
              >
                Cancel
              </Button>
              <Button onClick={handleSubmit} className="flex-1 bg-pink-500">
                Create Plan
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}