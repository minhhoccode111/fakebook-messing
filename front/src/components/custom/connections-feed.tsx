import axios from "axios";
import useAuthStore from "@/stores/auth";
import { useEffect, useState } from "react";

import { ApiOrigin } from "@/shared/constants";

import { Connections } from "@/shared/types";

import ConnectionsKind from "@/components/custom/connections-kind";
import ConnectionSelf from "@/components/custom/connection-self";
import useConnectionsFeedStore from "@/stores/connections-feed";

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

      <ConnectionSelf self={self}></ConnectionSelf>

      <ConnectionsKind
        isAllowActions={true}
        text="friends"
        connections={friends}
      ></ConnectionsKind>

      <ConnectionsKind
        isAllowActions={true}
        text="followings"
        connections={followings}
      ></ConnectionsKind>

      <ConnectionsKind
        isAllowActions={true}
        text="followers"
        connections={followers}
      ></ConnectionsKind>

      <ConnectionsKind
        isAllowActions={true}
        text="mayknows"
        connections={mayknows}
      ></ConnectionsKind>
    </div>
  );
};

export default ConnectionsFeed;
