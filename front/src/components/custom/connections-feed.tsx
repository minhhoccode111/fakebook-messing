import axios from "axios";
import { useAuthStore } from "@/main";
import { useEffect, useState } from "react";

import { ApiOrigin } from "@/shared/constants";

import { Connections } from "@/shared/types";

import ConnectionsKind from "@/components/custom/connections-kind";

const useConnectionsFetch = () => {
  const token = useAuthStore((state) => state.authData.token);

  const [isError, setIsError] = useState(false);
  const [connectionsFeed, setConnectionsFeed] = useState<
    undefined | Connections
  >();

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

  return { isError, connectionsFeed };
};

const ConnectionsFeed = ({
  className,
  children,
}: {
  className: string;
  children: React.ReactNode;
}) => {
  const { isError, connectionsFeed } = useConnectionsFetch();

  // NOTE: don't know why can't use LoadingWrapper because
  // it's tell Connections.friends can possibly be undefined
  // but if it's undefined then it will not be rendered
  // and loading will be rendered instead, weird
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

  return (
    <div className={"" + " " + className}>
      {children}

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
