import { useParams, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

import {
  AiOutlineExclamationCircle,
  AiOutlineLoading3Quarters,
} from "react-icons/ai";

import useConnectionsFeedStore from "@/stores/connections-feed";
import useAuthStore from "@/stores/auth";

import { ApiOrigin } from "@/shared/constants";
import { Connections } from "@/shared/types";

import ConnectionsKind from "@/components/custom/connections-kind";
import Connection from "@/components/custom/connection";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

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

  if (isError)
    return (
      <div className="h-full grid place-items-center">
        <span className="text-red-500 animate-ping transition-all">
          <AiOutlineExclamationCircle />
        </span>
      </div>
    );

  if (!userConnections)
    return (
      <div className="h-full grid place-items-center">
        <span className="text-yellow-500 animate-spin transition-all">
          <AiOutlineLoading3Quarters />
        </span>
      </div>
    );

  const { friends, followers, followings, mayknows } = userConnections;

  return (
    <div className="max-w-[70ch] mx-auto">
      <h2 className="text-xl font-bold my-8">
        {isSelf
          ? "Your connections"
          : `${userConnections.self.fullname}'s connections`}
      </h2>

      <Connection
        isAllowActions={false}
        user={userConnections.self}
      ></Connection>

      <Accordion type="single" collapsible>
        <AccordionItem
          value="item-1"
          className="border-gray-900 dark:border-gray-100"
        >
          <AccordionTrigger>
            <h3>{friends?.length} Friends</h3>
          </AccordionTrigger>
          <AccordionContent>
            <ConnectionsKind
              isAllowActions={isSelf}
              text="friends"
              connections={friends}
            ></ConnectionsKind>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem
          value="item-2"
          className="border-gray-900 dark:border-gray-100"
        >
          <AccordionTrigger>
            <h3>{followings?.length} Followings</h3>
          </AccordionTrigger>
          <AccordionContent>
            <ConnectionsKind
              isAllowActions={isSelf}
              text="followings"
              connections={followings}
            ></ConnectionsKind>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem
          value="item-3"
          className="border-gray-900 dark:border-gray-100"
        >
          <AccordionTrigger>
            <h3>{followers?.length} Followers</h3>
          </AccordionTrigger>
          <AccordionContent>
            <ConnectionsKind
              isAllowActions={isSelf}
              text="followers"
              connections={followers}
            ></ConnectionsKind>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem
          value="item-4"
          className="border-gray-900 dark:border-gray-100"
        >
          <AccordionTrigger>
            <h3>{mayknows?.length} Mayknows</h3>
          </AccordionTrigger>
          <AccordionContent>
            <ConnectionsKind
              isAllowActions={isSelf}
              text="mayknows"
              connections={mayknows}
            ></ConnectionsKind>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default UserConnections;
