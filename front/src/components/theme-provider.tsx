import { Fragment, useEffect } from "react";
import { create } from "zustand";
import EnvVar from "@/shared/constants";
import {
  Theme,
  StateThemeStore,
  ActionThemeStore,
  ReactPropChildren,
} from "@/shared/types";

// const LOCAL_STORAGE_THEME_NAME = "fakebook-messing";
const { ThemeStoreName } = EnvVar;

export const useThemeStore = create<StateThemeStore & ActionThemeStore>(
  (set) => ({
    // get data in local forage or use default
    theme:
      // `as Theme` make sure that the local forage data always valid theme
      (localStorage.getItem(ThemeStoreName) as Theme) || "system",
    setTheme: (theme) => {
      // theme changes also update local storage data
      localStorage.setItem(ThemeStoreName, theme);
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
