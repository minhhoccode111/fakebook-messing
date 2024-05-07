import axios from "axios";
import { useAuthStore } from "@/main";
import useSWR from "swr";

import EnvVar from "@/shared/constants";
const { ApiOrigin } = EnvVar;

const connectionsFetcher = (token: string) => (url: string) =>
  axios({
    url,
    method: "get",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).then((res) => res.data);

const ConnectionsFeed = () => {
  const { token } = useAuthStore((state) => state.authData);
  const url = ApiOrigin + `/users`;
  const { data, error, isLoading } = useSWR(
    url,
    connectionsFetcher(token as string),
  );

  console.log(data);

  return (
    <div className="">
      <h2 className="">All connections in feed</h2>
      <div className="">
        {error ? "error occurs" : isLoading ? "loading..." : "data connections"}
      </div>
    </div>
  );
};

export default ConnectionsFeed;
