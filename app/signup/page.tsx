"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Phone, Lock, User, Mail } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { toast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

const MotionInput = motion(Input);
const MotionButton = motion(Button);

export default function SignupPage() {
  const router = useRouter();

  const { register, isLoading, error } = useAuthStore() as {
    register: (
      fullName: string,
      email: string,
      phoneNumber: string,
      password: string,
      confirmPassword: string,
      referralCode?: string
    ) => Promise<any>;
    isLoading: boolean;
    error: string | null;
  };

  const [fullName, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [referralCode, setReferralCode] = useState<string>("");

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      await register(
        fullName,
        email,
        phoneNumber,
        password,
        confirmPassword,
        referralCode
      );
      toast.success("Account created successfully!");
      router.push("/login");
    } catch (err) {
      toast.error("Signup failed. Please try again.");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.36, ease: "easeOut" }}
      className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4"
    >
      <div className="w-full max-w-md">
        <motion.div
          initial={{ scale: 0.995, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 280, damping: 24 }}
          className="bg-white rounded-lg shadow-lg p-8 md:p-10"
        >
          <div className="text-center mb-8">
            <motion.h1
              initial={{ y: 6, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.32 }}
              className="text-3xl md:text-4xl font-bold text-slate-900 mb-2"
            >
              Create Account
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.08 }}
              className="text-slate-600 text-sm md:text-base"
            >
              Join Top Mart today
            </motion.p>
          </div>

          <AnimatePresence initial={false}>
            {error && (
              <motion.p
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.22 }}
                className="text-red-500 text-sm mb-3 text-center"
              >
                {String(error)}
              </motion.p>
            )}
          </AnimatePresence>

          <motion.form
            onSubmit={handleSignUp}
            className="space-y-5"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.28 }}
          >
            <div>
              <label className="block text-sm font-medium text-slate-900 mb-2">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <MotionInput
                  type="text"
                  placeholder="Enter your full name"
                  value={fullName}
                  onChange={(e) => setName(e.target.value)}
                  className="pl-10 h-11 border-slate-200 text-slate-900 placeholder:text-slate-400"
                  whileFocus={{ scale: 1.01 }}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-900 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <MotionInput
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 h-11 border-slate-200 text-slate-900 placeholder:text-slate-400"
                  whileFocus={{ scale: 1.01 }}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-900 mb-2">
                Phone Number
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <MotionInput
                  type="tel"
                  placeholder="Enter your phone number"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="pl-10 h-11 border-slate-200 text-slate-900 placeholder:text-slate-400"
                  whileFocus={{ scale: 1.01 }}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-900 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <MotionInput
                  type="password"
                  placeholder="Create a password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 h-11 border-slate-200 text-slate-900 placeholder:text-slate-400"
                  whileFocus={{ scale: 1.01 }}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-900 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <MotionInput
                  type="password"
                  placeholder="Confirm password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="pl-10 h-11 border-slate-200 text-slate-900 placeholder:text-slate-400"
                  whileFocus={{ scale: 1.01 }}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-900 mb-2">
                Referral Code (optional)
              </label>
              <div className="relative">
                <MotionInput
                  type="text"
                  placeholder="optional"
                  value={referralCode}
                  onChange={(e) => setReferralCode(e.target.value)}
                  className="pl-4 h-11 border-slate-200 text-slate-900 placeholder:text-slate-400"
                  whileFocus={{ scale: 1.01 }}
                />
              </div>
            </div>

            <MotionButton
              type="submit"
              disabled={isLoading}
              whileTap={{ scale: 0.98 }}
              whileHover={{ scale: 1.02 }}
              className="w-full h-11 bg-pink-500 hover:bg-pink-600 text-white font-semibold rounded-lg transition-colors"
            >
              {isLoading ? "Creating account..." : "Create Account"}
            </MotionButton>
          </motion.form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-slate-500">
                Already have an account?
              </span>
            </div>
          </div>

          <MotionButton
            onClick={() => router.push("/login")}
            variant="outline"
            whileTap={{ scale: 0.98 }}
            className="w-full h-11 border-slate-300 text-slate-900 font-semibold hover:bg-slate-50 bg-transparent"
          >
            Sign in
          </MotionButton>
        </motion.div>
      </div>
    </motion.div>
  );
}
