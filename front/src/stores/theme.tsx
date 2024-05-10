import { create } from "zustand";

import { ThemeStoreName } from "@/shared/constants";

type Theme = "dark" | "light" | "system";

type StateThemeStore = {
  theme: Theme;
};

type ActionThemeStore = {
  setTheme: (theme: Theme) => void;
};

export const useThemeStore = create<StateThemeStore & ActionThemeStore>(
  (set) => ({
    theme: (localStorage.getItem(ThemeStoreName) as Theme) || "system",
    setTheme: (theme) => {
      localStorage.setItem(ThemeStoreName, theme);
      set(() => ({ theme }));
    },
  }),
);
