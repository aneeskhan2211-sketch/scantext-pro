import { useAppStore } from "@/stores/appStore";
import type { Theme } from "@/types";
import { useEffect } from "react";

export function useTheme() {
  const { theme, setTheme, toggleTheme } = useAppStore();

  // Apply theme class on mount and changes
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);
  }, [theme]);

  const switchTheme = (t: Theme) => {
    setTheme(t);
  };

  return {
    theme,
    setTheme: switchTheme,
    toggleTheme,
    isDark: theme === "dark",
  };
}
