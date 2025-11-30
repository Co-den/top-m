// authStore.ts
"use client";

import { create } from "zustand";
import axios from "axios";

const API_BASE = "https://top-mart-api.onrender.com/api/auth";
const CURRENT_USER = "https://top-mart-api.onrender.com/api/users";

export interface User {
  phone: string;
  uniqueId: string;
  balance: number;
  bankAccount: {
    bankName: string;
    accountNumber: string;
    accountName: string;
  } | null;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  setUser: (user: User | null) => void;
  login: (phoneNumber: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (
    fullName: string,
    email: string,
    phoneNumber: string,
    password: string,
    confirmPassword: string,
    referralCode?: string
  ) => Promise<any>;
  getCurrentUser: () => Promise<User | null>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  setUser: (user) => set({ user, isAuthenticated: !!user }),

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
      const res = await axios.post(
        `${API_BASE}/register`,
        {
          fullName,
          email,
          phoneNumber,
          password,
          confirmPassword,
          referralCode,
        },
        { withCredentials: true }
      );
      set({ isLoading: false });
      return res.data;
    } catch (err: any) {
      set({
        error: err?.response?.data?.message ?? "Registration failed",
        isLoading: false,
      });
      throw err;
    }
  },

  login: async (phoneNumber, password) => {
    set({ isLoading: true, error: null });
    try {
      const res = await axios.post(
        `${API_BASE}/login`,
        { phoneNumber, password },
        { withCredentials: true }
      );

      const token = res.data?.token;
      if (token) {
        localStorage.setItem("token", token);
      }

      // hydrate immediately
      await useAuthStore.getState().getCurrentUser();
      set({ isLoading: false });
    } catch (err: any) {
      set({
        error: err?.response?.data?.message ?? "Login failed",
        isLoading: false,
      });
      throw err;
    }
  },

  logout: async () => {
    set({ isLoading: true, error: null });
    try {
      await axios.post(`${API_BASE}/logout`, {}, { withCredentials: true });
    } finally {
      localStorage.removeItem("token");
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },

  getCurrentUser: async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return null;

      const res = await axios.get(`${CURRENT_USER}/me`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });

      const user: User = res.data;
      set({ user, isAuthenticated: true });
      return user;
    } catch (err) {
      set({
        user: null,
        isAuthenticated: false,
        error: "Failed to fetch current user",
      });
      return null;
    }
  },
}));
