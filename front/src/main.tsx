import React from "react";
import ReactDOM from "react-dom/client";
import Router from "./router.tsx";
import "./css/index.css";
import "./css/app.css";

import { create } from "zustand";
import {
  Theme,
  StateThemeStore,
  ActionThemeStore,
  StateAuthStore,
  ActionAuthStore,
} from "@/shared/types";

import EnvVar from "@/shared/constants";
const { ThemeStoreName, AuthStoreName } = EnvVar;

// INIT ZUSTAND STORES HERE
export const useThemeStore = create<StateThemeStore & ActionThemeStore>(
  (set) => ({
    theme: (localStorage.getItem(ThemeStoreName) as Theme) || "system",
    setTheme: (theme) => {
      localStorage.setItem(ThemeStoreName, theme);
      set(() => ({ theme }));
    },
  }),
);

export const useAuthStore = create<StateAuthStore & ActionAuthStore>((set) => ({
  authData: localStorage.getItem(AuthStoreName) || {},
  setAuthData: (data) =>
    set(() => {
      console.log(`the authData is: `, data); // TODO: turn off in production
      localStorage.setItem(AuthStoreName, JSON.stringify(data));
      return { authData: data };
    }),
}));

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Router />
  </React.StrictMode>,
);
