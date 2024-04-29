import { Await, defer, useLoaderData } from "react-router-dom";
import { useAuthStore } from "@/main";
import { Suspense, useEffect, useState } from "react";
import axios from "axios";

import Custom from "@/components/custom";
const { MyAvatar } = Custom;

import EnvVar from "@/shared/constants";
const { ApiOrigin } = EnvVar;

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

// type FetchFeed = () => Promise<{
//   feed: null | Post[];
//   isLoadingFeed: boolean;
//   isErrorFeed: boolean;
// }>;

// dangerous because using localStorage info?
export const loaderFakebookFeed = async () => {
  return null;
};

const useFetchFeed = () => {
  const token = useAuthStore((state) => state.authData?.token);

  const [isLoadingFeed, setIsLoadingFeed] = useState(false);
  const [isErrorFeed, setIsErrorFeed] = useState(false);
  const [feed, setFeed] = useState([]);

  useEffect(() => {
    const tmp = async () => {
      try {
        setIsLoadingFeed(true);
        const res = await axios({
          method: "get",
          url: ApiOrigin + "/users/feed",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log(res.data);

        setFeed(res.data);
      } catch (err) {
        console.log(err);

        setIsErrorFeed(true);
      } finally {
        setIsLoadingFeed(false);
      }
    };

    tmp();
  }, [token]);

  return { feed, isLoadingFeed, isErrorFeed };
};

const FakebookFeed = () => {
  const { feed, isLoadingFeed, isErrorFeed } = useFetchFeed();

  return (
    <div className="">
      <h2 className="">news feed</h2>

      {isErrorFeed ? (
        "error loading feed."
      ) : isLoadingFeed ? (
        "loading feed..."
      ) : (
        <ul className="">
          {feed.map((post: Post, index: number) => {
            const {
              creator: { fullname, status, avatarLink },
              comments,
              content,
              createdAtFormatted,
              likes,
            } = post;
            return (
              <li key={index}>
                <h3 className="font-bold">Post</h3>
                <p className="font-bold">{content}</p>
                <p className="">Likes: {likes}</p>
                <div className="">
                  <h3 className="font-bold">Post's Creator</h3>
                  <p className="">{fullname}</p>
                  <p className="">{status}</p>
                  <MyAvatar src={avatarLink} fallback={"zz"} />
                </div>

                <ul className="">
                  <h3 className="font-bold">Comments</h3>
                  {comments.map((comment: Comment, index: number) => {
                    const {
                      creator: { fullname, status, avatarLink },
                      content,
                      createdAtFormatted,
                      likes,
                    } = comment;
                    return (
                      <li key={index}>
                        <p className="">{content}</p>
                        <p className="">{likes}</p>
                        <p className="">{createdAtFormatted}</p>
                        <p className="">Creator: {fullname}</p>
                        <p className="">{status}</p>
                        <MyAvatar src={avatarLink} fallback={"zz"} />
                      </li>
                    );
                  })}
                </ul>
                <p className="">Created: {createdAtFormatted}</p>
                <hr className="" />
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default FakebookFeed;
