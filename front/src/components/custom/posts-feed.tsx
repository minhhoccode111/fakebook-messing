import { useAuthStore } from "@/main";
import axios from "axios";

import { ApiOrigin } from "@/shared/constants";

import { PostType } from "@/shared/types";

import { useEffect, useState } from "react";

import Post from "@/components/custom/post";

import LoadingWrapper from "@/components/custom/loading-wrapper";

const usePostsFetcher = () => {
  const token = useAuthStore((state) => state.authData.token);

  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [postsFeed, setPostsFeed] = useState([]);

  useEffect(() => {
    const tmp = async () => {
      try {
        setIsLoading(true);
        const res = await axios({
          url: ApiOrigin + `/users/feed`,
          method: "get",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log(res.data);

        setPostsFeed(res.data);
      } catch (err) {
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };

    tmp();
  }, [token]);

  return { isLoading, isError, postsFeed };
};

const PostsFeed = ({
  className,
  children,
}: {
  className: string;
  children: React.ReactNode;
}) => {
  const { isLoading, isError, postsFeed } = usePostsFetcher();

  return (
    <div className={"" + " " + className}>
      {children}

      <LoadingWrapper isLoading={isLoading} isError={isError}>
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
