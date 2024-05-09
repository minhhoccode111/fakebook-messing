import MyAvatar from "@/components/custom/my-avatar";
import { User } from "@/shared/types";
import { Link } from "react-router-dom";

const ConnectionSelf = ({ self }: { self: User }) => {
  return (
    <div className="">
      <p className="font-bold">self</p>
      <p className="">{self.fullname}</p>
      <p className="">{self.status}</p>

      <MyAvatar src={self.avatarLink!} fallback={self.fullname.charAt(0)!} />

      <div className="flex gap-2 items-center justify-between">
        {/* change route to /profile */}
        <Link to={`/fakebook/profile/${self.id}`}>view profile</Link>
      </div>
    </div>
  );
};

export default ConnectionSelf;
