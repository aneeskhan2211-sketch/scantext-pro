import type { Theme, ToastMessage } from "@/types";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AppState {
  theme: Theme;
  activeTab: string;
  isGlobalLoading: boolean;
  notifications: ToastMessage[];
  hasSeenOnboarding: boolean;
  hasSeenSplash: boolean;
}

interface AppActions {
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  setActiveTab: (tab: string) => void;
  setGlobalLoading: (value: boolean) => void;
  addNotification: (msg: Omit<ToastMessage, "id">) => void;
  removeNotification: (id: string) => void;
  setHasSeenOnboarding: (value: boolean) => void;
  setHasSeenSplash: (value: boolean) => void;
}

export const useAppStore = create<AppState & AppActions>()(
  persist(
    (set) => ({
      theme: "dark",
      activeTab: "home",
      isGlobalLoading: false,
      notifications: [],
      hasSeenOnboarding: false,
      hasSeenSplash: false,

      setTheme: (theme) => {
        set({ theme });
        const root = document.documentElement;
        root.classList.remove("light", "dark");
        root.classList.add(theme);
      },

      toggleTheme: () =>
        set((state) => {
          const next = state.theme === "dark" ? "light" : "dark";
          document.documentElement.classList.remove("light", "dark");
          document.documentElement.classList.add(next);
          return { theme: next };
        }),

      setActiveTab: (tab) => set({ activeTab: tab }),
      setGlobalLoading: (value) => set({ isGlobalLoading: value }),

      addNotification: (msg) =>
        set((state) => ({
          notifications: [
            ...state.notifications,
            { ...msg, id: `${Date.now()}-${Math.random()}` },
          ],
        })),

      removeNotification: (id) =>
        set((state) => ({
          notifications: state.notifications.filter((n) => n.id !== id),
        })),

      setHasSeenOnboarding: (value) => set({ hasSeenOnboarding: value }),
      setHasSeenSplash: (value) => set({ hasSeenSplash: value }),
    }),
    {
      name: "scantext-app",
      partialize: (state) => ({
        theme: state.theme,
        hasSeenOnboarding: state.hasSeenOnboarding,
        hasSeenSplash: state.hasSeenSplash,
      }),
    },
  ),
);
