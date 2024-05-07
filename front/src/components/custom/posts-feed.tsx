import { useAuthStore } from "@/main";
import useSWR from "swr";
import axios from "axios";

import { ApiOrigin } from "@/shared/constants";

import { create } from "zustand";

import { StatePostsFeedStore, ActionPostsFeedStore } from "@/shared/types";

import { useEffect } from "react";

import Post from "@/components/custom/post";
import LoadingWrapper from "@/components/custom/loading-wrapper";

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

  const { data, error, isLoading } = useSWR(url, postsFetcher(token as string));

  useEffect(() => {
    if (data) setPostsFeed(data);
  }, [data, setPostsFeed]);

  // console.log(data);

  return (
    <div className={"" + " " + className}>
      {children}

      <LoadingWrapper isLoading={isLoading} isError={error}>
        <ul className="">
          {postsFeed.map((post, index: number) => (
            <Post key={index} post={post} />
          ))}
        </ul>
      </LoadingWrapper>
    </div>
  );
};

export default PostsFeed;
