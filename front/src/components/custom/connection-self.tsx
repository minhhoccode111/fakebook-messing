import MyAvatar from "@/components/custom/my-avatar";
import { User } from "@/shared/types";
import { Link } from "react-router-dom";

const ConnectionSelf = ({ user }: { user: User }) => {
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
    <div className="flex gap-2 items-center justify-between my-2">
      <MyAvatar src={user.avatarLink} fallback={user.fullname.charAt(0)} />

      <div className="">
        <div className={"w-2 h-2 rounded-full" + " " + bg}></div>
      </div>

      <Link className="flex-1" to={`/fakebook/profile/${user.id}`}>
        {user.fullname}
      </Link>
    </div>
  );
};

export default ConnectionSelf;
