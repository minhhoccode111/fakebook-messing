import { useParams, Navigate } from "react-router-dom";

import { useAuthStore } from "@/main";

import { Connections } from "@/shared/types";
import { useEffect, useState } from "react";

import { ApiOrigin } from "@/shared/constants";
import axios from "axios";
import ConnectionSelf from "@/components/custom/connection-self";
import ConnectionsKind from "@/components/custom/connections-kind";
import { useConnectionsFeedStore } from "@/components/custom/connections-feed";

const useUserConnectionsFetcher = () => {
  const { userid } = useParams();

  const authData = useAuthStore((state) => state.authData);
  const selfid = authData.self?.id;

  const isSelf = userid === selfid;

  const [isError, setIsError] = useState(false);
  const [userConnections, setUserConnections] = useState<
    undefined | Connections
  >();

  const connectionsFeed = useConnectionsFeedStore(
    (state) => state.connectionsFeed,
  );

  useEffect(() => {
    const tmp = async () => {
      try {
        const res = await axios({
          url: ApiOrigin + `/users/${userid}/connections`,
          method: "get",
          headers: {
            Authorization: `Bearer ${authData.token}`,
          },
        });

        // console.log(res.data);

        setUserConnections(res.data);
      } catch (err) {
        setIsError(true);
      }
    };

    // only fetch if not self profile
    if (!isSelf) tmp();
    // else use the one we fetched in /feed
    else setUserConnections(connectionsFeed);
  }, [authData.token, connectionsFeed]);

  return { isError, userConnections, connectionsFeed, isSelf };
};

const UserConnections = () => {
  const { isError, userConnections, connectionsFeed, isSelf } =
    useUserConnectionsFetcher();

  // WARN: if user go straight to this route without preparing connectionsFeed
  // in /feed route, then navigate them to the route
  if (isSelf && !connectionsFeed) return <Navigate to={"/fakebook/feed"} />;

  if (isError) return <div className="">error</div>;
  if (!userConnections) return <div className="">loading</div>;

  const { friends, followers, followings, mayknows } = userConnections;

  return (
    <div className="">
      <h2 className="">All connections of {userConnections.self.fullname}</h2>

      <ConnectionSelf self={userConnections.self}></ConnectionSelf>

      <ConnectionsKind
        isAllowActions={isSelf}
        text="friends"
        connections={friends}
      ></ConnectionsKind>

      <ConnectionsKind
        isAllowActions={isSelf}
        text="followings"
        connections={followings}
      ></ConnectionsKind>

      <ConnectionsKind
        isAllowActions={isSelf}
        text="followers"
        connections={followers}
      ></ConnectionsKind>

      <ConnectionsKind
        isAllowActions={isSelf}
        text="mayknows"
        connections={mayknows}
      ></ConnectionsKind>
    </div>
  );
};

export default UserConnections;
