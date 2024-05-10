import { Link } from "react-router-dom";

import { User, ConnectionsText } from "@/shared/types";

import MyAvatar from "@/components/custom/my-avatar";
import FollowButton from "@/components/custom/follow-button";

type ConnectionPropsType = {
  user: User;
  text?: ConnectionsText;
  isAllowActions: boolean;
};

const Connection = ({ user, text, isAllowActions }: ConnectionPropsType) => {
  const followButtonText =
    text === "friends" || text === "followings" ? "unfollow" : "follow";

  let bg;
  switch (user.status) {
    case "online":
      bg = "bg-online";
      break;
    case "offline":
      bg = "bg-offline";
      break;
    case "busy":
      bg = "bg-busy";
      break;
    case "afk":
      bg = "bg-afk";
      break;
  }

  return (
    <li className="flex gap-2 items-center justify-between my-2">
      <MyAvatar src={user.avatarLink} fallback={user.fullname.charAt(0)} />

      <div className="">
        <div className={"w-2 h-2 rounded-full" + " " + bg}></div>
      </div>

      <Link className="flex-1" to={`/fakebook/profile/${user.id}`}>
        {user.fullname}
      </Link>

      {isAllowActions && (
        <FollowButton followButtonText={followButtonText} user={user} />
      )}
    </li>
  );
};

export default Connection;
