// src/components/FloatingAIButton.tsx
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { UserCircle } from "lucide-react";
import AIAssistant from "@/components/AIassistant";

interface Plan {
  _id?: string;
  id?: string;
  name: string;
  description?: string;
  price?: number;
  category?: string;
  inStock?: boolean;
  cycleDays?: string | number;
  dailyReturn?: string | number;
  totalReturn?: string | number;
  specifications?: Record<string, any>;
}

interface FloatingAIButtonProps {
  plans: Plan | Plan[] | Record<string, any>;
}

export default function FloatingAIButton({ plans }: FloatingAIButtonProps) {
  const [open, setOpen] = useState<boolean>(false);

  // Lock body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [open]);

  // Close modal on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) {
        setOpen(false);
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [open]);

  return (
    <>
      {/* Floating Button */}
      <motion.button
        onClick={() => setOpen(true)}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
        className="fixed right-4 bottom-20 sm:right-6 sm:bottom-24 z-[60]
                   bg-linear-to-br from-pink-600 to-pink-700
                   text-white px-4 py-3 rounded-full shadow-2xl 
                   flex items-center gap-2 hover:shadow-pink-500/50
                   transition-shadow duration-300 group"
        aria-label="Open AI Assistant"
        title="Ask AI about products"
      >
        <span className="absolute inset-0 rounded-full bg-pink-600 animate-ping opacity-20 group-hover:opacity-30" />
        <UserCircle className="w-6 h-6 relative z-10" />
        
      </motion.button>

      {/* AI Modal */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4"
          >
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setOpen(false)}
              aria-label="Close modal"
            />

            {/* Modal Content */}
            <motion.div
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "100%", opacity: 0 }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="relative z-50 w-full sm:w-11/12 md:w-3/4 lg:w-2/3 xl:w-1/2 max-w-3xl
                         max-h-[100vh] sm:max-h-[90vh] overflow-hidden rounded-t-2xl sm:rounded-2xl shadow-2xl"
            >
              <AIAssistant plan={plans} onClose={() => setOpen(false)} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
