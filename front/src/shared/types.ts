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

export type CounterStoreState = {
  count: number;
};

export type CounterStoreActions = {
  inc: () => void;
  dec: () => void;
  reset: () => void;
};

export type PersonStoreState = {
  firstname: string;
  lastname: string;
};

export type PersonStoreActions = {
  updateFirstname: (firstname: string) => void;
  updateLastname: (lastname: string) => void;
};
