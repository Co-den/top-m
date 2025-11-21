"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import axios from "axios";

// Set axios to send cookies with requests
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
  token?: string | null; // <- added
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
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      isCheckingAuth: true,
      error: null,
      message: null,

      register: async (fullName, email, phoneNumber, password, confirmPassword, referralCode) => {
        set({ isLoading: true, error: null });
        try {
          const { data } = await axios.post("https://top-mart-api.onrender.com/api/auth/register", {
            fullName,
            email,
            phoneNumber,
            password,
            confirmPassword,
            referralCode,
          });

          // set token header if provided
          if (data?.token) {
            axios.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;
          }

          set({ user: data.user, token: data?.token ?? null, isAuthenticated: true, isLoading: false });
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
          const { data } = await axios.post("https://top-mart-api.onrender.com/api/auth/login", {
            phoneNumber,
            password,
          });

          if (data?.token) {
            axios.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;
          }

          set({
            user: data.user,
            token: data?.token ?? null,
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

          // remove auth header
          delete axios.defaults.headers.common["Authorization"];

          set({
            user: null,
            token: null,
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
          const { data } = await axios.post("https://top-mart-api.onrender.com/api/auth/verify-email", { code });

          if (data?.token) {
            axios.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;
          }

          set({ user: data.user, token: data?.token ?? null, isAuthenticated: true, isLoading: false });
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
          const { data } = await axios.get("https://top-mart-api.onrender.com/api/auth/check-auth");
          // if server returns token, set header
          if (data?.token) {
            axios.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;
          }
          set({
            user: data.user,
            token: data?.token ?? null,
            isAuthenticated: true,
            isCheckingAuth: false,
          });
          return data;
        } catch {
          // ensure header cleared on failed check
          delete axios.defaults.headers.common["Authorization"];
          set({ isAuthenticated: false, isCheckingAuth: false, error: null, token: null });
        }
      },

      forgotPassword: async (email) => {
        set({ isLoading: true, error: null });
        try {
          const { data } = await axios.post("https://top-mart-api.onrender.com/api/auth/forgot-password", { email });
          set({ message: data.message, isLoading: false });
          return data;
        } catch (error: any) {
          const msg = getErrorMessage(error);
          set({ error: msg || "Error sending reset password email", isLoading: false });
          throw error;
        }
      },

      resetPassword: async (token, password) => {
        set({ isLoading: true, error: null });
        try {
          const { data } = await axios.post(`https://top-mart-api.onrender.com/api/auth/reset-password/${token}`, { password });
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
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
