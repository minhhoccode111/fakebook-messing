import { Link } from "react-router-dom";

import { User, ConnectionsText } from "@/shared/types";

import MyAvatar from "@/components/custom/my-avatar";
import FollowButton from "@/components/custom/follow-button";

type ConnectionPropsType = {
  user: User;
  text: ConnectionsText;
  isAllowActions: boolean;
};

const Connection = ({ user, text, isAllowActions }: ConnectionPropsType) => {
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
          // onClick={() => setSelfActionWithConnection(followButtonText)}
          to={`/fakebook/profile/${user.id}`}
        >
          view profile
        </Link>

        {isAllowActions && (
          <FollowButton followButtonText={followButtonText} user={user} />
        )}
      </div>
    </li>
  );
};

export default Connection;
