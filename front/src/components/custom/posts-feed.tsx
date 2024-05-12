import { useEffect, useState } from "react";
import axios from "axios";

import {
  AiOutlineExclamationCircle,
  AiOutlineLoading3Quarters,
} from "react-icons/ai";

import { PostType, User } from "@/shared/types";
import { ApiOrigin } from "@/shared/constants";

import usePostsFeedStore from "@/stores/posts-feed";
import useAuthStore from "@/stores/auth";

import Post from "@/components/custom/post";

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

const PostsFeed = ({ className }: { className: string }) => {
  const { isError } = usePostsFetcher();

  const { postsFeed, setPostsFeed } = usePostsFeedStore();

  const self = useAuthStore((state) => state.authData.self) as User;

  if (isError)
    return (
      <div className="grid place-items-center">
        <span className="text-red-500 animate-ping transition-all">
          <AiOutlineExclamationCircle />
        </span>
      </div>
    );

  if (!postsFeed)
    return (
      <div className="grid place-items-center">
        <span className="text-black animate-spin transition-all">
          <AiOutlineLoading3Quarters />
        </span>
      </div>
    );

  return (
    <div className={"" + " " + className}>
      <h2 className="text-xl font-bold my-8">News Feed</h2>

      <div className="">
        <ul className="">
          {postsFeed?.map((post: PostType, index: number) => {
            const isSelf = post.creator.id === self.id;

            return (
              <Post
                key={index}
                post={post}
                className={""}
                isSelf={isSelf}
                allPostsState={postsFeed}
                setAllPostsState={setPostsFeed}
              />
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default PostsFeed;
