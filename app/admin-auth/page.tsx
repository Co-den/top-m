"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff, Shield, Lock, Mail, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

interface LoginFormData {
  email: string;
  password: string;
}

interface RegisterFormData {
  fullName: string;
  email: string;
  phoneNumber: string;
  password: string;
  confirmPassword: string;
}

const MotionInput = motion(Input);
const MotionButton = motion(Button);

export default function AdminAuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [loginForm, setLoginForm] = useState<LoginFormData>({
    email: "",
    password: "",
  });

  const [registerForm, setRegisterForm] = useState<RegisterFormData>({
    fullName: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
    
  });

  const handleLogin = async () => {
    setError(null);
    setLoading(true);

    try {
      const response = await fetch(
        "https://top-mart-api.onrender.com/api/admin/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(loginForm),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      // Redirect to admin dashboard on success
      window.location.href = "/admin";
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    setError(null);

    // Validation
    if (registerForm.password !== registerForm.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (registerForm.password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "https://top-mart-api.onrender.com/api/admin/register",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            fullName: registerForm.fullName,
            email: registerForm.email,
            phoneNumber: registerForm.phoneNumber,
            password: registerForm.password,
            confirmPassword: registerForm.confirmPassword,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }

      // Redirect to admin dashboard on success
      window.location.href = "/admin";
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent, action: () => void) => {
    if (e.key === "Enter") {
      action();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.36, ease: "easeOut" }}
      className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4"
    >
      <div className="w-full max-w-md">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="text-center mb-8"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.06, duration: 0.3 }}
            className="inline-flex items-center justify-center w-16 h-16 bg-pink-500/20 rounded-full mb-4"
          >
            <Shield className="w-8 h-8 text-pink-500" />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl font-bold text-black mb-2"
          >
            Admin Portal
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.12 }}
            className="text-black"
          >
            {isLogin ? "Sign in to manage investments" : "Create admin account"}
          </motion.p>
        </motion.div>

        {/* Auth Card */}
        <motion.div
          layout
          initial={{ scale: 0.995, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 280, damping: 24, delay: 0.1 }}
          className="bg-white rounded-lg shadow-lg p-8 md:p-10"
        >
          {/* Tab Switcher */}
          <motion.div
            layout
            className="flex gap-2 mb-6 p-1 bg-slate-800/50 rounded-lg"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.14 }}
          >
            <motion.button
              onClick={() => {
                setIsLogin(true);
                setError(null);
              }}
              whileTap={{ scale: 0.98 }}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition ${
                isLogin
                  ? "bg-pink-500 text-white"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Login
            </motion.button>
            <motion.button
              onClick={() => {
                setIsLogin(false);
                setError(null);
              }}
              whileTap={{ scale: 0.98 }}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition ${
                !isLogin
                  ? "bg-pink-500 text-white"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Register
            </motion.button>
          </motion.div>

          {/* Error Message */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.22 }}
                className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg"
              >
                <p className="text-red-400 text-sm">{error}</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Login Form */}
          <AnimatePresence mode="wait">
            {isLogin ? (
              <motion.div
                key="login"
                initial={{ opacity: 0, x: 6 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -6 }}
                transition={{ duration: 0.25 }}
                className="space-y-4"
              >
                <motion.div
                  layout
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.16 }}
                >
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <MotionInput
                      type="email"
                      value={loginForm.email}
                      onChange={(e) =>
                        setLoginForm({ ...loginForm, email: e.target.value })
                      }
                      onKeyPress={(e) => handleKeyPress(e, handleLogin)}
                      className="pl-10 h-11 border-slate-200 text-slate-900 placeholder:text-slate-400"
                      placeholder="admin@example.com"
                      whileFocus={{ scale: 1.01 }}
                    />
                  </div>
                </motion.div>

                <motion.div
                  layout
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.18 }}
                >
                  <label className="block text-sm font-medium text-black mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <MotionInput
                      type={showPassword ? "text" : "password"}
                      value={loginForm.password}
                      onChange={(e) =>
                        setLoginForm({ ...loginForm, password: e.target.value })
                      }
                      onKeyPress={(e) => handleKeyPress(e, handleLogin)}
                      className="pl-10 h-11 border-slate-200 text-slate-900 placeholder:text-slate-800"
                      placeholder="••••••••"
                      whileFocus={{ scale: 1.01 }}
                    />
                    <motion.button
                      onClick={() => setShowPassword(!showPassword)}
                      whileTap={{ scale: 0.95 }}
                      whileHover={{ scale: 1.05 }}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </motion.button>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <MotionButton
                    onClick={handleLogin}
                    disabled={loading}
                    whileTap={{ scale: 0.98 }}
                    whileHover={{ scale: 1.02 }}
                    className="w-full bg-pink-500 hover:bg-pink-600 text-white py-6 rounded-lg font-medium disabled:opacity-50"
                  >
                    {loading ? "Signing in..." : "Sign In"}
                  </MotionButton>
                </motion.div>
              </motion.div>
            ) : (
              // Register Form
              <motion.div
                key="register"
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 6 }}
                transition={{ duration: 0.25 }}
                className="space-y-4"
              >
                <motion.div
                  layout
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.16 }}
                >
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <MotionInput
                      type="text"
                      value={registerForm.fullName}
                      onChange={(e) =>
                        setRegisterForm({
                          ...registerForm,
                          fullName: e.target.value,
                        })
                      }
                      className="pl-10 h-11 border-slate-200 text-slate-900 placeholder:text-slate-400"
                      placeholder="John Doe"
                      whileFocus={{ scale: 1.01 }}
                    />
                  </div>
                </motion.div>

                <motion.div
                  layout
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.18 }}
                >
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <MotionInput
                      type="email"
                      value={registerForm.email}
                      onChange={(e) =>
                        setRegisterForm({
                          ...registerForm,
                          email: e.target.value,
                        })
                      }
                      className="pl-10 h-11 border-slate-200 text-slate-900 placeholder:text-slate-400"
                      placeholder="admin@example.com"
                      whileFocus={{ scale: 1.01 }}
                    />
                  </div>
                </motion.div>

                <motion.div
                  layout
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                > 
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <MotionInput
                      type="tel"
                      value={registerForm.phoneNumber}
                      onChange={(e) =>
                        setRegisterForm({
                          ...registerForm,
                          phoneNumber: e.target.value,
                        })
                      }
                      className="pl-10 h-11 border-slate-200 text-slate-900 placeholder:text-slate-400"
                      placeholder="+1234567890"
                      whileFocus={{ scale: 1.01 }}
                    />
                  </div>
                </motion.div>

                <motion.div
                  layout
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <MotionInput
                      type={showPassword ? "text" : "password"}
                      value={registerForm.password}
                      onChange={(e) =>
                        setRegisterForm({
                          ...registerForm,
                          password: e.target.value,
                        })
                      }
                      className="pl-10 h-11 border-slate-200 text-slate-900 placeholder:text-slate-400"
                      placeholder="••••••••"
                      whileFocus={{ scale: 1.01 }}
                    />
                    <motion.button
                      onClick={() => setShowPassword(!showPassword)}
                      whileTap={{ scale: 0.95 }}
                      whileHover={{ scale: 1.05 }}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </motion.button>
                  </div>
                </motion.div>

                <motion.div
                  layout
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.22 }}
                >
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <MotionInput
                      type={showConfirmPassword ? "text" : "password"}
                      value={registerForm.confirmPassword}
                      onChange={(e) =>
                        setRegisterForm({
                          ...registerForm,
                          confirmPassword: e.target.value,
                        })
                      }
                      className="pl-10 h-11 border-slate-200 text-slate-900 placeholder:text-slate-400"
                      placeholder="••••••••"
                      whileFocus={{ scale: 1.01 }}
                    />
                    <motion.button
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      whileTap={{ scale: 0.95 }}
                      whileHover={{ scale: 1.05 }}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </motion.button>
                  </div>
                </motion.div>


                <motion.div
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.26 }}
                >
                  <MotionButton
                    onClick={handleRegister}
                    disabled={loading}
                    whileTap={{ scale: 0.98 }}
                    whileHover={{ scale: 1.02 }}
                    className="w-full bg-pink-500 hover:bg-pink-600 text-white py-6 rounded-lg font-medium disabled:opacity-50"
                  >
                    {loading ? "Creating account..." : "Create Admin Account"}
                  </MotionButton>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.28 }}
          className="text-center text-slate-500 text-sm mt-6"
        >
          Secured by end-to-end encryption
        </motion.p>
      </div>
    </motion.div>
  );
}
