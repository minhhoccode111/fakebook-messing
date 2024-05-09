import { useParams } from "react-router-dom";

import { useParamUserStore } from "@/routes/fakebook/user-layout";
import { useAuthStore } from "@/main";

import { Connections, User } from "@/shared/types";
import { useEffect, useState } from "react";

import { ApiOrigin } from "@/shared/constants";
import axios from "axios";
import ConnectionSelf from "@/components/custom/connection-self";
import ConnectionsKind from "@/components/custom/connections-kind";

const useUserConnectionsFetcher = () => {
  const { userid } = useParams();

  const token = useAuthStore((state) => state.authData.token);

  const [isError, setIsError] = useState(false);
  const [userConnections, setUserConnections] = useState<
    undefined | Connections
  >();

  useEffect(() => {
    const tmp = async () => {
      try {
        const res = await axios({
          url: ApiOrigin + `/users/${userid}/connections`,
          method: "get",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // console.log(res.data);

        setUserConnections(res.data);
      } catch (err) {
        setIsError(true);
      }
    };

    tmp();
  }, [token]);

  return { isError, userConnections };
};

const UserConnections = () => {
  // identify authorization of current profile
  const { self } = useAuthStore((state) => state.authData);
  const paramUser = useParamUserStore((state) => state.paramUser) as User;
  const isSelf = paramUser?.id === self?.id;

  const { isError, userConnections } = useUserConnectionsFetcher();

  if (isError) return <div className="">error</div>;
  if (!userConnections) return <div className="">loading</div>;

  const { friends, followers, followings, mayknows } = userConnections;

  return (
    <div className="">
      <h2 className="">All connections of {userConnections.self.fullname}</h2>

      <ConnectionSelf self={userConnections.self}></ConnectionSelf>

      <ConnectionsKind text="friends" connections={friends}></ConnectionsKind>

      <ConnectionsKind
        text="followings"
        connections={followings}
      ></ConnectionsKind>

      <ConnectionsKind
        text="followers"
        connections={followers}
      ></ConnectionsKind>

      <ConnectionsKind text="mayknows" connections={mayknows}></ConnectionsKind>
    </div>
  );
};

export default UserConnections;
