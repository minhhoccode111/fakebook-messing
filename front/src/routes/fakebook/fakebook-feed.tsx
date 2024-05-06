import useSWR from "swr";
import axios from "axios";

import Custom from "@/components/custom";
const { MyAvatar } = Custom;

import EnvVar from "@/shared/constants";
const { ApiOrigin, AuthStoreName } = EnvVar;

import { useAuthStore } from "@/main";

type User = {
  fullname: string;
  status: string;
  bio: string;
  avatarLink: string;
};

type Post = {
  content: string;
  creator: User;
  comments: Comment[];
  likes: number;
  createdAtFormatted: string;
};

type Comment = {
  creator: User;
  likes: number;
  content: string;
  createdAtFormatted: string;
};

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
  const url = import.meta.env.VITE_API_ORIGIN + `/users`;
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

const PostsFeed = () => {
  const { token } = useAuthStore((state) => state.authData);
  const url = import.meta.env.VITE_API_ORIGIN + `/users/feed`;
  const { data, error, isLoading } = useSWR(
    url,
    connectionsFetcher(token as string),
  );

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

const NewPost = () => {
  return (
    <div className="">
      <h2 className="">Create a new post</h2>
    </div>
  );
};

const FakebookFeed = () => {
  return (
    <main className="grid gap-2">
      <NewPost></NewPost>
      <ConnectionsFeed></ConnectionsFeed>
      <PostsFeed></PostsFeed>
    </main>
  );
};

export default FakebookFeed;
