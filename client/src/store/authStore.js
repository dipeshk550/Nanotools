import { create } from "zustand";
import { persist } from "zustand/middleware";
import api from "../utils/api";

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      login: async (email, password) => {
        const { data } = await api.post("/auth/login", { email, password });
        set({ user: data.user, token: data.token, isAuthenticated: true });
        api.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;
        return data;
      },

      register: async (name, email, password) => {
        const { data } = await api.post("/auth/register", { name, email, password });
        return data;
      },

      verifyOTP: async (userId, otp) => {
        const { data } = await api.post("/auth/verify-otp", { userId, otp });
        set({ user: data.user, token: data.token, isAuthenticated: true });
        api.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;
        return data;
      },

      logout: async () => {
        try { await api.post("/auth/logout"); } catch (_) {}
        delete api.defaults.headers.common["Authorization"];
        set({ user: null, token: null, isAuthenticated: false });
      },

      refreshToken: async () => {
        try {
          const { data } = await api.post("/auth/refresh");
          set({ token: data.token });
          api.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;
        } catch (_) { get().logout(); }
      },

      updateUser: (updates) => set((state) => ({ user: { ...state.user, ...updates } })),
    }),
    { name: "nanotools-auth", partialize: (s) => ({ user: s.user, token: s.token, isAuthenticated: s.isAuthenticated }) }
  )
);
