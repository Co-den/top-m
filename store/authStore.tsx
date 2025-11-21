"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import axios from "axios";

// API URL
const API_URL =
  process.env.NODE_ENV === "development"
    ? "https://top-mart-api.onrender.com/api/auth"
    : "/api/auth";

axios.defaults.withCredentials = true;

// Helper to extract error messages
function getErrorMessage(err: any) {
  return (
    err?.response?.data?.message ??
    err?.response?.data?.error ??
    err?.message ??
    "An unexpected error occurred"
  );
}

// Define types
interface User {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  password?: string;
  comfirmPassword?: string;
  referralCode?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isCheckingAuth: boolean;
  error: string | null;
  message: string | null;

  register: (
    fullName: string,
    email: string,
    phoneNumber: string,
    password: string,
    confirmPassword: string,
    referralCode?: string
  ) => Promise<any>;

  login: (phoneNumber: string, password: string) => Promise<any>;
  logout: () => Promise<void>;
  verifyEmail: (code: string) => Promise<any>;
  checkAuth: () => Promise<any>;
  forgotPassword: (email: string) => Promise<any>;
  resetPassword: (token: string, password: string) => Promise<any>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      isCheckingAuth: true,
      error: null,
      message: null,

      register: async (
        fullName,
        email,
        phoneNumber,
        password,
        confirmPassword,
        referralCode
      ) => {
        set({ isLoading: true, error: null });
        try {
          const { data } = await axios.post(
            "https://top-mart-api.onrender.com/api/auth/register",
            {
              fullName,
              email,
              phoneNumber,
              password,
              confirmPassword,
              referralCode,
            }
          );

          set({ user: data.user, isAuthenticated: true, isLoading: false });
          return data;
        } catch (error: any) {
          const msg = getErrorMessage(error);
          set({ error: msg, isLoading: false });
          throw error;
        }
      },

      login: async (phoneNumber, password) => {
        set({ isLoading: true, error: null });
        try {
          const { data } = await axios.post(
            "https://top-mart-api.onrender.com/api/auth/login",
            {
              phoneNumber,
              password,
            }
          );
          set({
            user: data.user,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
          return data;
        } catch (error: any) {
          const msg = getErrorMessage(error);
          set({ error: msg, isLoading: false });
          throw error;
        }
      },

      logout: async () => {
        set({ isLoading: true, error: null });
        try {
          await axios.post("https://top-mart-api.onrender.com/api/auth/logout");
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
          });
        } catch (error: any) {
          const msg = getErrorMessage(error);
          set({ error: msg || "Error logging out", isLoading: false });
          throw error;
        }
      },

      verifyEmail: async (code) => {
        set({ isLoading: true, error: null });
        try {
          const { data } = await axios.post(
            "https://top-mart-api.onrender.com/api/auth/verify-email",
            { code }
          );
          set({ user: data.user, isAuthenticated: true, isLoading: false });
          return data;
        } catch (error: any) {
          const msg = getErrorMessage(error);
          set({ error: msg, isLoading: false });
          throw error;
        }
      },

      checkAuth: async () => {
        set({ isCheckingAuth: true, error: null });
        try {
          const { data } = await axios.get(
            "https://top-mart-api.onrender.com/api/auth/check-auth"
          );
          set({
            user: data.user,
            isAuthenticated: true,
            isCheckingAuth: false,
          });
          return data;
        } catch {
          set({ isAuthenticated: false, isCheckingAuth: false, error: null });
        }
      },

      forgotPassword: async (email) => {
        set({ isLoading: true, error: null });
        try {
          const { data } = await axios.post(
            "https://top-mart-api.onrender.com/api/auth/forgot-password",
            { email }
          );
          set({ message: data.message, isLoading: false });
          return data;
        } catch (error: any) {
          const msg = getErrorMessage(error);
          set({
            error: msg || "Error sending reset password email",
            isLoading: false,
          });
          throw error;
        }
      },

      resetPassword: async (token, password) => {
        set({ isLoading: true, error: null });
        try {
          const { data } = await axios.post(
            `https://top-mart-api.onrender.com/api/auth/reset-password/${token}`,
            { password }
          );
          set({ message: data.message, isLoading: false });
          return data;
        } catch (error: any) {
          const msg = getErrorMessage(error);
          set({ error: msg || "Error resetting password", isLoading: false });
          throw error;
        }
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
