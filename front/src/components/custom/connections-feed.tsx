import axios from "axios";
import { useAuthStore } from "@/main";
import { useEffect, useState } from "react";

import { ApiOrigin } from "@/shared/constants";

import {
  StateConnectionsFeedStore,
  ActionConnectionsFeedStore,
  Connections,
} from "@/shared/types";

import ConnectionsKind from "@/components/custom/connections-kind";

import { create } from "zustand";
import MyAvatar from "@/components/custom/my-avatar";

const useConnectionsFeedStore = create<
  StateConnectionsFeedStore & ActionConnectionsFeedStore
>((set) => ({
  connectionsFeed: undefined,
  setConnectionsFeed: (newConnections) =>
    set(() => ({ connectionsFeed: newConnections })),
}));

const useConnectionsFetch = () => {
  const token = useAuthStore((state) => state.authData.token);

  const [isError, setIsError] = useState(false);

  // to set global connections store
  const setConnectionsFeed = useConnectionsFeedStore(
    (state) => state.setConnectionsFeed,
  );

  useEffect(() => {
    const tmp = async () => {
      try {
        const res = await axios({
          url: ApiOrigin + `/users`,
          method: "get",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // console.log(res.data);

        setConnectionsFeed(res.data);
      } catch (err) {
        setIsError(true);
      }
    };

    tmp();
  }, [token]);

  return { isError };
};

const ConnectionsFeed = ({
  className,
  children,
}: {
  className: string;
  children: React.ReactNode;
}) => {
  const { isError } = useConnectionsFetch();

  // to user global connections store
  const connectionsFeed = useConnectionsFeedStore(
    (state) => state.connectionsFeed,
  ) as Connections;

  if (isError) return;
  <div className={"" + " " + className}>
    {children}
    <p className="">error</p>
  </div>;

  if (!connectionsFeed) return;
  <div className={"" + " " + className}>
    {children}
    <p className="">loading</p>
  </div>;

  const { self, friends, followers, followings, mayknows } = connectionsFeed;

  return (
    <div className={"" + " " + className}>
      {children}

      <p className="">data connections ready</p>
      <div className="">
        <p className="">{self.fullname}</p>
        <p className="">{self.status}</p>

        <MyAvatar src={self.avatarLink!} fallback={self.fullname.charAt(0)!} />
      </div>

      <ConnectionsKind label="friends" connections={friends}></ConnectionsKind>

      <ConnectionsKind
        label="followings"
        connections={followings}
      ></ConnectionsKind>

      <ConnectionsKind
        label="followers"
        connections={followers}
      ></ConnectionsKind>

      <ConnectionsKind
        label="mayknows"
        connections={mayknows}
      ></ConnectionsKind>
    </div>
  );
};

export default ConnectionsFeed;
