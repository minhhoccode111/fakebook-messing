import { Link } from "react-router-dom";

import { User, ConnectionsText } from "@/shared/types";

import MyAvatar from "@/components/custom/my-avatar";
import FollowButton from "@/components/custom/follow-button";

type ConnectionPropsType = {
  user: User;
  className?: string;
  text?: ConnectionsText;
  isAllowActions: boolean;
};

const Connection = ({
  user,
  text,
  className,
  isAllowActions,
}: ConnectionPropsType) => {
  // proper text based on connection between self and other
  const followButtonText =
    text === "friends" || text === "followings" ? "unfollow" : "follow";

  return (
    <div
      className={
        "flex gap-2 items-center justify-between my-2" + " " + className
      }
    >
      <MyAvatar
        status={user.status}
        src={user.avatarLink}
        fallback={user.fullname.charAt(0)}
      />

      <Link
        className="flex-1 font-bold text-lg overflow-auto whitespace-nowrap"
        to={`/fakebook/profile/${user.id}`}
      >
        {user.fullname}
      </Link>

      {isAllowActions && (
        <FollowButton followButtonText={followButtonText} user={user} />
      )}
    </div>
  );
};

export default Connection;
