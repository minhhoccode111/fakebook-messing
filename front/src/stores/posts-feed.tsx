import { create } from "zustand";

import { PostType } from "@/shared/types";

type StatePostsFeedStore = {
  postsFeed: undefined | PostType[];
};

type ActionPostsFeedStore = {
  setPostsFeed: (newPosts: PostType[]) => void;
};

const usePostsFeedStore = create<StatePostsFeedStore & ActionPostsFeedStore>(
  (set) => ({
    postsFeed: undefined,
    setPostsFeed: (newPosts) => set(() => ({ postsFeed: newPosts })),
  }),
);

export default usePostsFeedStore;
