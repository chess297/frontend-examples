import { create } from "zustand";
import { devtools } from "zustand/middleware";

export enum Theme {
  LIGHT = "light",
  DARK = "dark",
}
type GlobalStoreState = {
  theme: Theme;
  // 系统异常
  error: string | null;
};
type GlobalStoreActions = {
  setTheme: (theme: Theme) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
};
export const useGlobalStore = create<GlobalStoreState & GlobalStoreActions>(
  (set) => ({
    theme: Theme.LIGHT,
    error: null,
    setTheme: (theme: Theme) => {
      set({ theme });
      const root = document.documentElement;
      if (theme === Theme.LIGHT) {
        root.classList.remove("dark");
        localStorage.setItem("theme", "light");
      } else {
        root.classList.add("dark");
        localStorage.setItem("theme", "dark");
      }
    },
    setError: (error: string | null) => set({ error }),
    clearError: () => set({ error: null }),
  })
);
