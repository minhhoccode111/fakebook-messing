import React from "react";
import ReactDOM from "react-dom/client";
import Router from "@/routes/router";
import "@/css/index.css";
import "@/css/app.css";

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

export const useAuthStore = create<StateAuthStore & ActionAuthStore>((set) => {
  const authData =
    localStorage.getItem(AuthStoreName) === null
      ? {}
      : // already check for null but typescript keep yelling at me
        // because the type of localStorage.getItem can be null?
        JSON.parse(localStorage.getItem(AuthStoreName) as string);

  return {
    authData,
    setAuthData: (data) =>
      set(() => {
        // TODO: turn off this console.log in production
        console.log(`the authData is: `, data);
        localStorage.setItem(AuthStoreName, JSON.stringify(data));
        return { authData: data };
      }),
  };
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Router />
  </React.StrictMode>,
);
