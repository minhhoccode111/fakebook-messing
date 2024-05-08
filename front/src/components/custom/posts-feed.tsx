import { useEffect, useState } from "react";
import axios from "axios";
import { create } from "zustand";

import { ApiOrigin } from "@/shared/constants";
import {
  StatePostsFeedStore,
  ActionPostsFeedStore,
  PostType,
} from "@/shared/types";
import { useAuthStore } from "@/main";

import LoadingWrapper from "@/components/custom/loading-wrapper";
import Post from "@/components/custom/post";

export const usePostsFeedStore = create<
  StatePostsFeedStore & ActionPostsFeedStore
>((set) => ({
  postsFeed: undefined,
  setPostsFeed: (newPosts) => set(() => ({ postsFeed: newPosts })),
}));

const usePostsFetcher = () => {
  const token = useAuthStore((state) => state.authData.token);

  const [isError, setIsError] = useState(false);
  const setPostsFeed = usePostsFeedStore((state) => state.setPostsFeed);

  useEffect(() => {
    const tmp = async () => {
      try {
        const res = await axios({
          url: ApiOrigin + `/users/feed`,
          method: "get",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // console.log(res.data);

        setPostsFeed(res.data);
      } catch (err) {
        setIsError(true);
      }
    };

    tmp();
  }, [token]);

  return { isError };
};

const PostsFeed = ({
  className,
  children,
}: {
  className: string;
  children: React.ReactNode;
}) => {
  const { isError } = usePostsFetcher();

  const postsFeed = usePostsFeedStore((state) => state.postsFeed);

  return (
    <div className={"" + " " + className}>
      {children}

      <LoadingWrapper isLoading={!postsFeed} isError={isError}>
        <ul className="">
          {postsFeed?.map((post: PostType, index: number) => (
            <Post key={index} post={post} />
          ))}
        </ul>
      </LoadingWrapper>
    </div>
  );
};

export default PostsFeed;
