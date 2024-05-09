import { useState } from "react";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { useAuthStore } from "@/main";
import { ConnectionsText, User } from "@/shared/types";
import { useParamUserStore } from "@/routes/fakebook/user-layout";

import MyAvatar from "@/components/custom/my-avatar";
import FollowButton from "@/components/custom/follow-button";
import { useConnectionsFeedStore } from "@/components/custom/connections-feed";
import { Navigate } from "react-router-dom";

const UserInfo = () => {
  // identify authorization of current profile
  const self = useAuthStore((state) => state.authData.self);
  const paramUser = useParamUserStore((state) => state.paramUser) as User;
  const isSelf = paramUser?.id === self?.id;

  // update connections after follow user
  const connectionsFeed = useConnectionsFeedStore(
    (state) => state.connectionsFeed,
  );

  // show or hide update info section
  const [isUpdating, setIsUpdating] = useState(false);

  // if user navigate straight to this route without prepare
  // connectionsFeed data in /feed, navigate them back
  if (!isSelf && !connectionsFeed) return <Navigate to={"/fakebook/feed"} />;

  let connectionType;

  // identify current user's connection vs. self
  for (const key in connectionsFeed) {
    if (key === "self") continue;

    const type = connectionsFeed[key as ConnectionsText];

    for (const user of type) {
      if (user.id === paramUser.id) connectionType = key;
    }
  }

  const followButtonText =
    connectionType === "friends" || connectionType === "followings"
      ? "unfollow"
      : "follow";

  return (
    <div className="max-w-[70ch]">
      <div className="grid place-items-center">
        <MyAvatar
          src={paramUser?.avatarLink}
          fallback={paramUser?.fullname.slice(0, 1)}
        />
      </div>

      {/* TODO: handle follow */}
      <div className="">
        {!isSelf && (
          <FollowButton followButtonText={followButtonText} user={paramUser} />
        )}
      </div>

      {/* TODO: add form to update*/}
      <form className="">
        <Table>
          <TableCaption>Info of current profile</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[120px]">key</TableHead>
              <TableHead className="text-right">value</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="font-medium">fullname</TableCell>
              <TableCell className="text-right">{paramUser.fullname}</TableCell>
            </TableRow>

            <TableRow>
              <TableCell className="font-medium">status</TableCell>
              <TableCell className="text-right">{paramUser.status}</TableCell>
            </TableRow>

            <TableRow>
              <TableCell className="font-medium">bio</TableCell>
              <TableCell className="text-right">{paramUser.bio}</TableCell>
            </TableRow>

            <TableRow>
              <TableCell className="font-medium">date of birth</TableCell>
              <TableCell className="text-right">
                {paramUser.dateOfBirthFormatted.split(" - ")[0]}
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell className="font-medium">created at</TableCell>
              <TableCell className="text-right">
                {paramUser.createdAtFormatted}
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell className="font-medium">updated at</TableCell>
              <TableCell className="text-right">
                {paramUser.updatedAtFormatted}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>

        <div className="flex gap-2 items-center justify-between">
          {/* button to update info if self */}
          {isSelf && (
            <button
              onClick={() => setIsUpdating((state) => !state)}
              className=""
            >
              {isUpdating ? "cancel" : "update"}
            </button>
          )}

          {isUpdating && (
            <button type="submit" className="">
              confirm
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default UserInfo;
