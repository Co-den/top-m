"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import axios from "axios";

axios.defaults.withCredentials = true;

const API = "https://top-mart-api.onrender.com/api/auth";
const USER_API = "https://top-mart-api.onrender.com/api/users";

interface User {
  id: string;
  fullName?: string;
  email?: string;
  phoneNumber?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  register: (...args: any[]) => Promise<any>;
  login: (phone: string, pass: string) => Promise<any>;
  logout: () => Promise<void>;
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
          if (token) axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
          set({ user, token, isAuthenticated: true, isLoading: false });
          return res.data;
        } catch (err: any) {
          set({ error: err?.response?.data?.message || err.message, isLoading: false });
          throw err;
        }
      },

      login: async (phoneNumber, password) => {
        set({ isLoading: true, error: null });
        try {
          const res = await axios.post(`${API}/login`, { phoneNumber, password });
          const token = res.data.token;
          const user = res.data.data.user;
          if (token) axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
          set({ user, token, isAuthenticated: true, isLoading: false });
          return res.data;
        } catch (err: any) {
          set({ error: err?.response?.data?.message || err.message, isLoading: false });
          throw err;
        }
      },

      logout: async () => {
        try {
          await axios.post(`${API}/logout`).catch(() => {});
        } finally {
          delete axios.defaults.headers.common["Authorization"];
          set({ user: null, token: null, isAuthenticated: false });
        }
      },

      checkAuth: async () => {
        const token = get().token;
        if (!token) {
          delete axios.defaults.headers.common["Authorization"];
          set({ isAuthenticated: false, user: null });
          return;
        }
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        try {
          const res = await axios.get(`${USER_API}/me`);
          set({ user: res.data.data.user, isAuthenticated: true });
        } catch {
          delete axios.defaults.headers.common["Authorization"];
          set({ user: null, token: null, isAuthenticated: false });
        }
      },
    }),
    {
      name: "topmart-auth",
      partialize: (state) => ({ token: state.token, user: state.user, isAuthenticated: state.isAuthenticated }),
      onRehydrateStorage: () => (state) => {
        if (state?.token) {
          axios.defaults.headers.common["Authorization"] = `Bearer ${state.token}`;
        }
      },
    }
  )
);

if (typeof window !== "undefined") {
  const store = useAuthStore.getState();
  if (store.token && !store.isAuthenticated) {
    store.checkAuth();
  }
}
