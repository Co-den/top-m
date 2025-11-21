"use client";

import type React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Phone, Lock } from "lucide-react";
import { useAuthStore } from "@/store/authStore";

export default function LoginPage() {
  const router = useRouter();

  const { login, isLoading, error } = useAuthStore() as {
    login: (phoneNumber: string, password: string) => Promise<void>;
    isLoading: boolean;
    error: string | null;
  };

  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [rememberMe, setRememberMe] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  // Ensure we render a string (not a function or other non-serializable value)
  const displayError =
    localError ?? (typeof error === "string" ? error : error ? String(error) : null);

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLocalError(null);
    if (!phoneNumber.trim() || !password) {
      setLocalError("Please enter phone number and password.");
      return;
    }
    try {
      await login(phoneNumber, password);
      router.push("/home");
    } catch (err: any) {
      console.error("login failed:", err);
      setLocalError(err?.message ?? "Login failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-lg p-8 md:p-10">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">
              Welcome Back
            </h1>
            <p className="text-slate-600 text-sm md:text-base">
              Sign in to your account
            </p>
          </div>

          <form onSubmit={handleSignIn} className="space-y-5">
            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-slate-900 mb-2"
              >
                Phone Number
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="Enter your phone number"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="pl-10 h-11 border-slate-200 text-slate-900 placeholder:text-slate-400"
                  required
                  aria-label="phone number"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-slate-900 mb-2"
              >
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 h-11 border-slate-200 text-slate-900 placeholder:text-slate-400"
                  required
                  aria-label="password"
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="remember"
                checked={rememberMe}
                onCheckedChange={(checked) => setRememberMe(Boolean(checked))}
              />
              <label
                htmlFor="remember"
                className="text-sm text-slate-700 cursor-pointer font-medium"
              >
                Remember me
              </label>
            </div>

            {localError || error ? (
              <div className="text-sm text-red-600 font-medium">
                {displayError}
              </div>
            ) : null}

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 bg-pink-500 hover:bg-pink-600 text-white font-semibold rounded-lg transition-colors disabled:opacity-60"
            >
              {isLoading ? "Logging in..." : "Sign in"}
            </Button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-slate-500">
                New to our platform?
              </span>
            </div>
          </div>

          <Button
            onClick={() => router.push("/signup")}
            variant="outline"
            className="w-full h-11 border-slate-300 text-slate-900 font-semibold hover:bg-slate-50 bg-transparent"
          >
            Create new account
          </Button>
        </div>
      </div>
    </div>
  );
}
