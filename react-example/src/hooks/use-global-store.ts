import { create } from "zustand";
import { devtools } from "zustand/middleware";

export enum Theme {
  LIGHT = "light",
  DARK = "dark",
}
type GlobalStoreState = {
  theme: Theme;
};
type GlobalStoreActions = {
  setTheme: (theme: Theme) => void;
};
export const useGlobalStore = create<GlobalStoreState & GlobalStoreActions>()(
  devtools((set, get) => ({
    theme: Theme.LIGHT,
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
  }))
);
