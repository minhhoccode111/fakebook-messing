import { create } from "zustand";

import { AuthStoreName } from "@/shared/constants";

type StateAuthStore = {
  authData: AuthData;
};

type ActionAuthStore = {
  setAuthData: (data: AuthData) => void;
};

type AuthData = {
  self?: {
    fullname: string;
    id: string;
  };
  isLogin?: boolean;
  token?: string;
};

const useAuthStore = create<StateAuthStore & ActionAuthStore>((set) => {
  const authData =
    localStorage.getItem(AuthStoreName) === null
      ? {}
      : // already check for null but typescript keep yelling at me
        // because the type of localStorage.getItem can be null?
        JSON.parse(localStorage.getItem(AuthStoreName) as string);

  return {
    authData,
    setAuthData: (data) => {
      // TODO: turn off this console.log in production
      // console.log(`the authData is: `, data);
      localStorage.setItem(AuthStoreName, JSON.stringify(data));
      set(() => ({ authData: data }));
    },
  };
});

export default useAuthStore;
