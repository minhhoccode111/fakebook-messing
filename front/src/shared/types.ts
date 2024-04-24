export type Theme = "dark" | "light" | "system";

export type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
};

export type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

export type CounterState = {
  count: number;
};

export type CounterActions = {
  inc: () => void;
  dec: () => void;
  reset: () => void;
};
