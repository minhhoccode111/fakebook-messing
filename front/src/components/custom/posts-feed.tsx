import { useAuthStore } from "@/main";
import axios from "axios";

import { ApiOrigin } from "@/shared/constants";

import { PostType } from "@/shared/types";

import { useEffect, useState } from "react";

import Post from "@/components/custom/post";

import LoadingWrapper from "@/components/custom/loading-wrapper";

const usePostsFetcher = () => {
  const token = useAuthStore((state) => state.authData.token);

  const [isError, setIsError] = useState(false);
  const [postsFeed, setPostsFeed] = useState<undefined | PostType[]>();

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

  return { isError, postsFeed };
};

const PostsFeed = ({
  className,
  children,
}: {
  className: string;
  children: React.ReactNode;
}) => {
  const { isError, postsFeed } = usePostsFetcher();

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
