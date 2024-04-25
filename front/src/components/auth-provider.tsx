import { Fragment } from "react";
import { create } from "zustand";
import {
  ReactPropChildren,
  StateAuthStore,
  ActionAuthStore,
} from "@/shared/types";
import EnvVar from "@/shared/constants";

const { AuthStoreName } = EnvVar;

export const useAuthStore = create<StateAuthStore & ActionAuthStore>((set) => ({
  authData: localStorage.getItem(AuthStoreName) || {},
  setAuthData: (data) =>
    set(() => {
      localStorage.setItem(AuthStoreName, JSON.stringify(data));
      return { authData: data };
    }),
}));

// whether the useAuthStore initialized?
export function AuthProvider({ children }: ReactPropChildren) {
  return <Fragment>{children}</Fragment>;
}
