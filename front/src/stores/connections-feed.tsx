import { create } from "zustand";

import { Connections } from "@/shared/types";

type StateConnectionsFeedStore = {
  connectionsFeed: undefined | Connections;
};
type ActionConnectionsFeedStore = {
  setConnectionsFeed: (newConnections: Connections) => void;
};

const useConnectionsFeedStore = create<
  StateConnectionsFeedStore & ActionConnectionsFeedStore
>((set) => ({
  connectionsFeed: undefined,
  setConnectionsFeed: (newConnections) =>
    set(() => ({ connectionsFeed: newConnections })),
}));

export default useConnectionsFeedStore;
