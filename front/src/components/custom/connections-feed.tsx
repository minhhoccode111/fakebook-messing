import {
  AiOutlineExclamationCircle,
  AiOutlineLoading3Quarters,
} from "react-icons/ai";
import { useEffect, useState } from "react";
import axios from "axios";

import { ApiOrigin } from "@/shared/constants";
import { Connections } from "@/shared/types";

import ConnectionsKind from "@/components/custom/connections-kind";
import Connection from "@/components/custom/connection";

import useConnectionsFeedStore from "@/stores/connections-feed";
import useAuthStore from "@/stores/auth";

import {
  Accordion,
  AccordionItem,
  AccordionContent,
  AccordionTrigger,
} from "@/components/ui/accordion";

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

const ConnectionsFeed = ({ className }: { className: string }) => {
  const { isError } = useConnectionsFetch();

  // to user global connections store
  const connectionsFeed = useConnectionsFeedStore(
    (state) => state.connectionsFeed,
  ) as Connections;

  if (isError)
    return (
      <div className={"h-full grid place-items-center" + " " + className}>
        <span className="text-red-500 animate-ping transition-all">
          <AiOutlineExclamationCircle />
        </span>
      </div>
    );

  if (!connectionsFeed)
    return (
      <div className={"h-full grid place-items-center" + " " + className}>
        <span className="text-yellow-500 animate-spin transition-all">
          <AiOutlineLoading3Quarters />
        </span>
      </div>
    );

  const { self, friends, followers, followings, mayknows } = connectionsFeed;

  return (
    <div className={"" + " " + className}>
      <h2 className="text-xl font-bold my-8">Your Connections</h2>

      <Connection isAllowActions={false} user={self}></Connection>

      <Accordion type="single" collapsible>
        <AccordionItem
          value="item-1"
          className="border-gray-900 dark:border-gray-100"
        >
          <AccordionTrigger>
            <h3>{friends.length} Friends</h3>
          </AccordionTrigger>
          <AccordionContent>
            <ConnectionsKind
              isAllowActions={true}
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
            <h3>{followings.length} Followings</h3>
          </AccordionTrigger>
          <AccordionContent>
            <ConnectionsKind
              isAllowActions={true}
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
            <h3>{followers.length} Followers</h3>
          </AccordionTrigger>
          <AccordionContent>
            <ConnectionsKind
              isAllowActions={true}
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
            <h3>{mayknows.length} Mayknows</h3>
          </AccordionTrigger>
          <AccordionContent>
            <ConnectionsKind
              isAllowActions={true}
              text="mayknows"
              connections={mayknows}
            ></ConnectionsKind>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default ConnectionsFeed;
