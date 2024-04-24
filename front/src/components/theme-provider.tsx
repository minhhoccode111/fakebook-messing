import { createContext, useContext, useEffect, useState } from "react";
import { Theme, ThemeProviderState, ThemeProviderProps } from "@/shared/types";

// a default initial state to create context
const initialState: ThemeProviderState = {
  theme: "system",
  setTheme: () => null,
};

// create a context with default initial state
const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "vite-ui-theme",
  ...props
}: ThemeProviderProps) {
  // a useState to work with themes
  const [theme, setTheme] = useState<Theme>(
    // first get the theme in local storage
    // or use default theme when the app first load
    () => (localStorage.getItem(storageKey) as Theme) || defaultTheme,
  );

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

  // a summary object to pass down context provider
  const value = {
    // get
    theme,
    // set the local storage and change current state
    setTheme: (theme: Theme) => {
      localStorage.setItem(storageKey, theme);
      setTheme(theme);
    },
  };

  return (
    // this create a context for every child components to use
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

// call this inside the theme provider wrapper
// will get a context object to manage states with theme and setTheme
export const useTheme = () => {
  const context = useContext(ThemeProviderContext);

  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider");

  return context;
};
