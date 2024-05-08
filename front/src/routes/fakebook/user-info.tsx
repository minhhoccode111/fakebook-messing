import { useParamUserStore } from "@/routes/fakebook/user-layout";
import { useAuthStore } from "@/main";
import MyAvatar from "@/components/custom/my-avatar";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { User } from "@/shared/types";
import { useState } from "react";

import { useConnectionsFeedStore } from "@/components/custom/connections-feed";
import { useCurrentConnectionStore } from "@/components/custom/connection";

const UserInfo = () => {
  const { self } = useAuthStore((state) => state.authData);

  const { connectionsFeed, setConnectionsFeed } = useConnectionsFeedStore();

  const paramUser = useParamUserStore((state) => state.paramUser) as User;

  // identify authorization of current profile
  const isSelf = paramUser?.id === self?.id;

  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const [isUpdating, setIsUpdating] = useState(false);

  // console.log(isSelf);

  const followButtonText = useCurrentConnectionStore(
    (state) => state.selfActionWithConnection,
  );

  if (paramUser === undefined)
    return (
      <div className="max-w-[70ch]">
        <p className="">loading</p>
      </div>
    );

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
        {isSelf ? (
          // button to update info if self
          <button onClick={() => setIsUpdating((state) => !state)} className="">
            update info
          </button>
        ) : (
          // button to follow or unfollow if not self
          <button className="">{followButtonText}</button>
        )}
      </div>

      {/* TODO: add form to update*/}
      <div className="">
        <Table>
          <TableCaption>Info of current profile</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[120px]">info</TableHead>
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
      </div>
    </div>
  );
};

export default UserInfo;
