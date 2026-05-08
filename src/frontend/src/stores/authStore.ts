import type { UserView } from "@/types";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthState {
  user: UserView | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

interface AuthActions {
  setUser: (user: UserView | null) => void;
  setIsAuthenticated: (value: boolean) => void;
  setLoading: (value: boolean) => void;
  setError: (error: string | null) => void;
  logout: () => void;
}

type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: true,
      error: null,

      setUser: (user) => set({ user, isAuthenticated: !!user }),
      setIsAuthenticated: (value) => set({ isAuthenticated: value }),
      setLoading: (value) => set({ isLoading: value }),
      setError: (error) => set({ error }),
      logout: () => set({ user: null, isAuthenticated: false, error: null }),
    }),
    {
      name: "scantext-auth",
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);
