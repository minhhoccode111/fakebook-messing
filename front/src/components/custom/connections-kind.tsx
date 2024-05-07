import { ConnectionsLabel, User } from "@/shared/types";
import { Link } from "react-router-dom";
import MyAvatar from "@/components/custom/my-avatar";

type ConnectionsKindType = {
  label: ConnectionsLabel;
  connections: User[];
};

const ConnectionsKind = ({ label, connections }: ConnectionsKindType) => {
  return (
    <div className="">
      <p className="font-bold">{label}</p>
      <ul className="">
        {connections.map((user, index) => (
          <li key={index} className="">
            <div className="">
              <p className="">{user.fullname}</p>
              <p className="">{user.status}</p>

              <MyAvatar
                src={user.avatarLink}
                fallback={user.fullname.charAt(0)}
              />
            </div>

            <div className="flex gap-2 items-center justify-between">
              {/* change route to /profile */}
              <Link to={`/fakebook/profile/${user.id}`}>view profile</Link>

              {/* TODO: add POST follow */}
              <button>
                {label === "friends" || label === "followings"
                  ? "unfollow"
                  : "follow"}
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ConnectionsKind;
