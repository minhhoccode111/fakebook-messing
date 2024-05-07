import { useAuthStore } from "@/main";
import useSWR from "swr";
import axios from "axios";

import { ApiOrigin } from "@/shared/constants";

import NewPostFeed from "@/components/custom/new-post-feed";

import { create } from "zustand";

import { StatePostsFeedStore, ActionPostsFeedStore } from "@/shared/types";

import { useEffect } from "react";

import Post from "@/components/custom/post";

export const usePostsFeedStore = create<
  StatePostsFeedStore & ActionPostsFeedStore
>((set) => ({
  postsFeed: [],
  setPostsFeed: (newPosts) => set(() => ({ postsFeed: newPosts })),
}));

const postsFetcher = (token: string) => (url: string) =>
  axios({
    url,
    method: "get",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).then((res) => res.data);

const PostsFeed = ({
  className,
  children,
}: {
  className: string;
  children: React.ReactNode;
}) => {
  const { token } = useAuthStore((state) => state.authData);

  const url = ApiOrigin + `/users/feed`;

  const { postsFeed, setPostsFeed } = usePostsFeedStore();

  const { data, error } = useSWR(url, postsFetcher(token as string));

  useEffect(() => {
    if (data) setPostsFeed(data);
  }, [data, setPostsFeed]);

  if (error)
    return (
      <div className={"" + " " + className}>
        {children}
        <p className="">loading posts error!</p>
      </div>
    );

  if (!data)
    return (
      <div className={"" + " " + className}>
        {children}
        <p className="">loading posts...</p>
      </div>
    );

  // console.log(data);

  return (
    <div className={"" + " " + className}>
      {children}

      {/* TODO: display create new post form in this? */}

      <NewPostFeed></NewPostFeed>

      <ul className="">
        {postsFeed.map((post, index: number) => (
          <Post key={index} post={post} />
        ))}
      </ul>
    </div>
  );
};

export default PostsFeed;
