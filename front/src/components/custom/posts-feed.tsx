import { useEffect, useState } from "react";
import axios from "axios";

import { ApiOrigin } from "@/shared/constants";
import { PostType, User } from "@/shared/types";
import useAuthStore from "@/stores/auth";

import LoadingWrapper from "@/components/custom/loading-wrapper";
import Post from "@/components/custom/post";

import usePostsFeedStore from "@/stores/posts-feed";

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
  children?: React.ReactNode;
}) => {
  const { isError } = usePostsFetcher();

  const { postsFeed, setPostsFeed } = usePostsFeedStore();

  const self = useAuthStore((state) => state.authData.self) as User;

  return (
    <div className={"" + " " + className}>
      <h2 className="text-xl font-bold my-8">News Feed</h2>

      <LoadingWrapper isLoading={!postsFeed} isError={isError}>
        <ul className="">
          {postsFeed?.map((post: PostType, index: number) => {
            const isSelf = post.creator.id === self.id;

            return (
              <Post
                className={""}
                key={index}
                post={post}
                isSelf={isSelf}
                allPostsState={postsFeed}
                setAllPostsState={setPostsFeed}
              />
            );
          })}
        </ul>
      </LoadingWrapper>
    </div>
  );
};

export default PostsFeed;
