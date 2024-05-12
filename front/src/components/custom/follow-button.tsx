import { useState } from "react";
import axios from "axios";

import useConnectionsFeedStore from "@/stores/connections-feed";
import useAuthStore from "@/stores/auth";

import { ApiOrigin } from "@/shared/constants";
import { User } from "@/shared/types";

import LoadingWrapper from "@/components/custom/loading-wrapper";

import { Button } from "@/components/ui/button";

type FollowButtonPropsType = {
  followButtonText: string;
  user: User;
};

const FollowButton = ({ user, followButtonText }: FollowButtonPropsType) => {
  const token = useAuthStore((state) => state.authData.token);

  const setConnectionsFeed = useConnectionsFeedStore(
    (state) => state.setConnectionsFeed,
  );

  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleFollowClick = async () => {
    try {
      setIsLoading(true);

      const res = await axios({
        url: ApiOrigin + `/users/${user.id}/follows`,
        method: "post",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // console.log(res.data);

      setConnectionsFeed(res.data);
    } catch (err) {
      console.log(err);

      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const variant = followButtonText === "follow" ? "default" : "destructive";

  return (
    <Button
      size={"sm"}
      type="button"
      variant={variant}
      className="capitalize"
      onClick={handleFollowClick}
      disabled={isError || isLoading}
    >
      <LoadingWrapper isLoading={isLoading} isError={isError}>
        {followButtonText}
      </LoadingWrapper>
    </Button>
  );
};

export default FollowButton;
