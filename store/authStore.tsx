"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import axios from "axios";

axios.defaults.withCredentials = true;

const API = "https://top-mart-api.onrender.com/api/auth";
const USER_API = "https://top-mart-api.onrender.com/api/users";

interface User {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  register: (...args: any[]) => Promise<any>;
  login: (phone: string, pass: string) => Promise<any>;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // -----------------------------
      // REGISTER
      // -----------------------------
      register: async (
        fullName,
        email,
        phoneNumber,
        password,
        confirmPassword,
        referralCode
      ) => {
        set({ isLoading: true, error: null });

        const res = await axios.post(`${API}/register`, {
          fullName,
          email,
          phoneNumber,
          password,
          confirmPassword,
          referralCode,
        });

        const token = res.data.token;
        const user = res.data.data.user;

        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

        set({
          user,
          token,
          isAuthenticated: true,
          isLoading: false,
        });

        return res.data;
      },

      // -----------------------------
      // LOGIN
      // -----------------------------
      login: async (phoneNumber, password) => {
        set({ isLoading: true, error: null });

        const res = await axios.post(`${API}/login`, {
          phoneNumber,
          password,
        });

        const token = res.data.token;
        const user = res.data.data.user;

        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

        set({
          user,
          token,
          isAuthenticated: true,
          isLoading: false,
        });
        return res.data;
      },

      // -----------------------------
      // LOGOUT
      // -----------------------------
      logout: () => {
        delete axios.defaults.headers.common["Authorization"];
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        });
      },

      // -----------------------------
      // CHECK AUTH (on page refresh)
      // -----------------------------
      checkAuth: async () => {
        const token = get().token;

        if (!token) {
          set({ isAuthenticated: false });
          return;
        }

        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

        try {
          const res = await axios.get(`${USER_API}/me`);
          set({
            user: res.data.data.user,
            isAuthenticated: true,
          });
        } catch {
          // Token invalid
          set({
            user: null,
            token: null,
            isAuthenticated: false,
          });
          delete axios.defaults.headers.common["Authorization"];
        }
      },
    }),

    {
      name: "topmart-auth",
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        if (!state) return;

        const token = state.token;
        if (token) {
          axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        }
      },
    }
  )
);
