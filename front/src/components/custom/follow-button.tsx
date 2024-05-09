import LoadingWrapper from "@/components/custom/loading-wrapper";
import { useAuthStore } from "@/main";
import { ApiOrigin } from "@/shared/constants";
import axios from "axios";
import { useState } from "react";
import { useConnectionsFeedStore } from "./connections-feed";
import { User } from "@/shared/types";

type FollowButtonPropsType = {
  user: User;
  followButtonText: string;
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

  return (
    <LoadingWrapper isLoading={isLoading} isError={isError}>
      <button type="button" onClick={handleFollowClick}>
        {followButtonText}
      </button>
    </LoadingWrapper>
  );
};

export default FollowButton;
