import axios from "axios";
import { useAuthStore } from "@/main";
import useSWR from "swr";
import { useEffect } from "react";

import { ApiOrigin } from "@/shared/constants";

import { create } from "zustand";

import {
  StateConnectionsFeedStore,
  ActionConnectionsFeedStore,
} from "@/shared/types";

import ConnectionsKind from "@/components/custom/connections-kind";

// store all connections with self
const useConnectionsFeedStore = create<
  StateConnectionsFeedStore & ActionConnectionsFeedStore
>((set) => ({
  connectionsFeed: {
    friends: [],
    followers: [],
    followings: [],
    mayknows: [],
  },
  setConnectionsFeed: (newConnections) =>
    set(() => ({
      connectionsFeed: newConnections,
    })),
}));

// fetch all connections with self
const connectionsFetcher = (token: string) => (url: string) =>
  axios({
    url,
    method: "get",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).then((res) => res.data);

const ConnectionsFeed = ({
  className,
  children,
}: {
  className: string;
  children: React.ReactNode;
}) => {
  const { token } = useAuthStore((state) => state.authData);

  const url = ApiOrigin + `/users`;

  const { data, error } = useSWR(url, connectionsFetcher(token as string));

  const { connectionsFeed, setConnectionsFeed } = useConnectionsFeedStore();

  // everytime data change will change global all connections global state
  useEffect(() => {
    if (data) setConnectionsFeed(data);
  }, [data, setConnectionsFeed]);

  // console.log(data);

  if (error)
    return (
      <div className={"" + " " + className}>
        {children}
        <p className="">loading connections error!</p>
      </div>
    );

  if (!data)
    return (
      <div className={"" + " " + className}>
        {children}
        <p className="">loading connections...</p>
      </div>
    );

  return (
    <div className={"" + " " + className}>
      <p className="">data connections ready</p>
      <div className="">
        <p className="font-bold">self</p>
        <p className="">{connectionsFeed?.self?.fullname}</p>
      </div>

      <ConnectionsKind
        label="friends"
        connections={connectionsFeed.friends}
      ></ConnectionsKind>

      <ConnectionsKind
        label="followings"
        connections={connectionsFeed.followings}
      ></ConnectionsKind>

      <ConnectionsKind
        label="followers"
        connections={connectionsFeed.followers}
      ></ConnectionsKind>

      <ConnectionsKind
        label="mayknows"
        connections={connectionsFeed.mayknows}
      ></ConnectionsKind>
    </div>
  );
};

export default ConnectionsFeed;
