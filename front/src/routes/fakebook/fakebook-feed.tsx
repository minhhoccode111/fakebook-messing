import { Await, defer, useLoaderData } from "react-router-dom";
import { Suspense, useEffect, useState } from "react";
import axios from "axios";

import Custom from "@/components/custom";
const { MyAvatar } = Custom;

import EnvVar from "@/shared/constants";
const { ApiOrigin, AuthStoreName } = EnvVar;

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

export const loaderFakebookFeed = async () => {
  const authData = JSON.parse(localStorage.getItem(AuthStoreName) as string);
  const token = authData.token;

  const feed = axios({
    url: ApiOrigin + `/users/feed`,
    method: "get",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const connections = axios({
    url: ApiOrigin + `/users`,
    method: "get",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return defer({ feed, connections });
};

type LoaderData = {
  feed: Post[];
  connections: object;
};

const FakebookFeed = () => {
  const data = useLoaderData() as LoaderData;

  return (
    <div className="">
      <h2 className="">Welcome to Fakebook feed</h2>
      <Suspense fallback={<p className="">Loading feed...</p>}>
        <Await
          resolve={data.feed}
          errorElement={<p className="">Error loader feed!</p>}
        >
          {/* this is the response  */}
          {({ data }) => {
            // console.log(data);

            return (
              <>
                <ul className="">
                  {data.map((post, index) => (
                    <li className="list-disc" key={index}>
                      {post.content}
                    </li>
                  ))}
                </ul>
              </>
            );
          }}
        </Await>
      </Suspense>

      <Suspense fallback={<p className="">Loading connections...</p>}>
        <Await
          resolve={data.connections}
          errorElement={<p className="">Error loader connections!</p>}
        >
          {({ data }) => {
            // console.log(data);

            return (
              <>
                <p className="">Self: {data.self.fullname}</p>
                <p className="">{}</p>
                <p className="">{data?.followings?.length}</p>
                <p className="">{data?.followers?.length}</p>
                <p className="">{data?.mayknows?.length}</p>
              </>
            );
          }}
        </Await>
      </Suspense>
    </div>
  );
};

export default FakebookFeed;
