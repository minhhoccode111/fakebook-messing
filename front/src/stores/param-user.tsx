import { create } from "zustand";

import { User } from "@/shared/types";

type StateParamUserStore = {
  paramUser: undefined | User;
};

type ActionParamUserStore = {
  setParamUser: (newUser: User) => void;
};

const useParamUserStore = create<StateParamUserStore & ActionParamUserStore>(
  (set) => ({
    paramUser: undefined,
    setParamUser: (newUser) => set(() => ({ paramUser: newUser })),
  }),
);

export default useParamUserStore;
