import { Fragment, useEffect } from "react";
import { create } from "zustand";
import EnvVar from "@/constants";
import {
  Theme,
  StateThemeStore,
  ActionThemeStore,
  ReactPropChildren,
} from "@/shared/types";

// const LOCAL_STORAGE_THEME_NAME = "fakebook-messing";
const THEME_STORE_NAME = EnvVar.ThemeStoreName;

export const useThemeStore = create<StateThemeStore & ActionThemeStore>(
  (set) => ({
    // get data in local storage or use default
    theme:
      // `as Theme` make sure that the local storage data always valid theme
      (localStorage.getItem(THEME_STORE_NAME) as Theme) || "system",
    setTheme: (theme) => {
      // theme changes also update local storage data
      localStorage.setItem(THEME_STORE_NAME, theme);
      set(() => ({ theme }));
    },
  }),
);

// component to change root classes each time theme in store changes
export function ThemeProvider({ children }: ReactPropChildren) {
  const theme = useThemeStore((state) => state.theme);

  // a useEffect to change root classes when theme changes
  useEffect(() => {
    const root = window.document.documentElement;

    root.classList.remove("light", "dark");

    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light";

      root.classList.add(systemTheme);
      return;
    }

    root.classList.add(theme);
  }, [theme]);

  return <Fragment>{children}</Fragment>;
}
