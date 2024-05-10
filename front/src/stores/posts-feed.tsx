import { PostType } from "@/shared/types";

import { create } from "zustand";

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
