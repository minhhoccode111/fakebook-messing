import { User, ConnectionsLabel } from "@/shared/types";
import { Link } from "react-router-dom";
import MyAvatar from "@/components/custom/my-avatar";
import LoadingWrapper from "@/components/custom/loading-wrapper";
import { useState } from "react";
import { useConnectionsFeedStore } from "@/components/custom/connections-feed";
import { ApiOrigin } from "@/shared/constants";
import { useAuthStore } from "@/main";
import axios from "axios";

const Connection = ({
  user,
  label,
}: {
  user: User;
  label: ConnectionsLabel;
}) => {
  const setConnectionsFeed = useConnectionsFeedStore(
    (state) => state.setConnectionsFeed,
  );

  const token = useAuthStore((state) => state.authData.token);

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
    <li className="">
      <div className="">
        <p className="">{user.fullname}</p>
        <p className="">{user.status}</p>

        <MyAvatar src={user.avatarLink} fallback={user.fullname.charAt(0)} />
      </div>

      <div className="flex gap-2 items-center justify-between">
        {/* change route to /profile */}
        <Link to={`/fakebook/profile/${user.id}`}>view profile</Link>

        <LoadingWrapper isLoading={isLoading} isError={isError}>
          <button type="button" onClick={handleFollowClick}>
            {label === "friends" || label === "followings"
              ? "unfollow"
              : "follow"}
          </button>
        </LoadingWrapper>
      </div>
    </li>
  );
};

export default Connection;
