import { useAuthStore } from "@/main";
import useSWR from "swr";
import axios from "axios";

import EnvVar from "@/shared/constants";
const { ApiOrigin } = EnvVar;

const postsFetcher = (token: string) => (url: string) =>
  axios({
    url,
    method: "get",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).then((res) => res.data);

const PostsFeed = () => {
  const { token } = useAuthStore((state) => state.authData);
  const url = ApiOrigin + `/users/feed`;
  const { data, error, isLoading } = useSWR(url, postsFetcher(token as string));

  console.log(data);

  return (
    <div className="">
      <h2 className="">All posts in feed</h2>
      <div className="">
        {error ? "error occurs" : isLoading ? "loading..." : "data posts"}
      </div>
    </div>
  );
};

export default PostsFeed;
