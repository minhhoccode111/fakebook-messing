export type StateAuthStore = {
  authData: AuthData;
};

export type ActionAuthStore = {
  setAuthData: (data: AuthData) => void;
};

export type AuthData = {
  self?: {
    fullname: string;
  };
  // TODO: add types for auth data after logging in
  isLogin?: boolean;
};

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

// export type LoginStatus = "ready" | "loading" | "success";
