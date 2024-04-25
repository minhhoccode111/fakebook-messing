export type Theme = "dark" | "light" | "system";

export type StateThemeStore = {
  theme: Theme;
};

export type ActionThemeStore = {
  setTheme: (theme: Theme) => void;
};

export type ReactPropChildren = {
  children: React.ReactNode;
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
