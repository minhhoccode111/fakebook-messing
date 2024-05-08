import { User, ConnectionsText } from "@/shared/types";
import { Link } from "react-router-dom";
import MyAvatar from "@/components/custom/my-avatar";
import LoadingWrapper from "@/components/custom/loading-wrapper";
import { useState } from "react";
import { useConnectionsFeedStore } from "@/components/custom/connections-feed";
import { ApiOrigin } from "@/shared/constants";
import { useAuthStore } from "@/main";
import axios from "axios";
import { create } from "zustand";

type ActionConnection = "follow" | "unfollow";

type StateCurrentConnectionStore = {
  selfActionWithConnection: ActionConnection;
};

type ActionCurrentConnectionStore = {
  setSelfActionWithConnection: (newAction: ActionConnection) => void;
};

export const useCurrentConnectionStore = create<
  StateCurrentConnectionStore & ActionCurrentConnectionStore
>((set) => ({
  selfActionWithConnection: "follow",
  setSelfActionWithConnection: (newAction) =>
    set(() => ({ selfActionWithConnection: newAction })),
}));

const Connection = ({ user, text }: { user: User; text: ConnectionsText }) => {
  const setConnectionsFeed = useConnectionsFeedStore(
    (state) => state.setConnectionsFeed,
  );

  const { setSelfActionWithConnection } = useCurrentConnectionStore();

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

  const followButtonText =
    text === "friends" || text === "followings" ? "unfollow" : "follow";

  return (
    <li className="">
      <div className="">
        <p className="">{user.fullname}</p>
        <p className="">{user.status}</p>

        <MyAvatar src={user.avatarLink} fallback={user.fullname.charAt(0)} />
      </div>

      <div className="flex gap-2 items-center justify-between">
        {/* change route to /profile */}
        <Link
          // click will set connection with self on a global store
          // to display better follow button text when we view their profile
          onClick={() => setSelfActionWithConnection(followButtonText)}
          to={`/fakebook/profile/${user.id}`}
        >
          view profile
        </Link>

        <LoadingWrapper isLoading={isLoading} isError={isError}>
          <button type="button" onClick={handleFollowClick}>
            {followButtonText}
          </button>
        </LoadingWrapper>
      </div>
    </li>
  );
};

export default Connection;
