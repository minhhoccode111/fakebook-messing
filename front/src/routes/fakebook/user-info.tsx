import { zodResolver } from "@hookform/resolvers/zod";
import { Navigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useState } from "react";
import axios from "axios";
import { z } from "zod";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import useConnectionsFeedStore from "@/stores/connections-feed";
import useParamUserStore from "@/stores/param-user";
import useAuthStore from "@/stores/auth";

import { Connections, ConnectionsText, User } from "@/shared/types";
import { UserInfoFormData } from "@/shared/forms";
import { ApiOrigin } from "@/shared/constants";
import { domParser } from "@/shared/methods";

import LoadingWrapper from "@/components/custom/loading-wrapper";
import FollowButton from "@/components/custom/follow-button";

type UserInfoFormData = {
  fullname: string;
  status: string;
  bio: string;
  dateOfBirth: string;
  avatarLink: string;
};

const UserInfo = () => {
  // identify authorization of current profile
  const self = useAuthStore((state) => state.authData.self) as User;
  const { authData, setAuthData } = useAuthStore();
  const { setConnectionsFeed } = useConnectionsFeedStore();
  const connectionsFeed = useConnectionsFeedStore(
    (state) => state.connectionsFeed,
  ) as Connections;
  const paramUser = useParamUserStore((state) => state.paramUser) as User;
  const isSelf = paramUser.id === self.id;

  // console.log(paramUser);

  const form = useForm<z.infer<typeof UserInfoFormData>>({
    resolver: zodResolver(UserInfoFormData),
    defaultValues: {
      fullname: paramUser.fullname,
      bio: paramUser.bio,
      status: paramUser.status,
      dateOfBirth: paramUser.dateOfBirthIso,
      avatarLink: paramUser.avatarLink,
    },
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  // show or hide update info section
  const [isUpdating, setIsUpdating] = useState(false);

  // if user navigate straight to this route without prepare
  // connectionsFeed data in /feed, navigate them back
  if (!isSelf && !connectionsFeed) return <Navigate to={"/fakebook/feed"} />;

  // console.log(self.fullname);

  const handleUpdateUserInfo = async (data: UserInfoFormData) => {
    try {
      setIsLoading(true);

      const res = await axios({
        method: "put",
        url: ApiOrigin + `/users/${self.id}`,
        headers: {
          Authorization: `Bearer ${authData.token}`,
        },
        data: {
          ...data,
        },
      });

      // console.log(res.data);
      const newSelf = res.data as User;

      setAuthData({ ...authData, self: newSelf });
      setConnectionsFeed({ ...connectionsFeed, self: newSelf });
      setIsUpdating(false);

      // do something with newly returned self
    } catch (err) {
      console.log(err);

      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

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

  let color;
  switch (paramUser.status) {
    case "online":
      color = "text-green-700";
      break;
    case "offline":
      color = "text-gray-700";
      break;
    case "busy":
      color = "text-red-700";
      break;
    case "afk":
      color = "text-yellow-700";
      break;
  }

  return (
    <div className="max-w-[70ch] mx-auto flex flex-col gap-4">
      <div className="grid place-items-center">
        <Avatar className="h-32 w-32">
          <AvatarImage src={domParser(paramUser.avatarLink)} />
          <AvatarFallback>
            {isUpdating
              ? self.fullname.slice(0, 1)
              : paramUser.fullname.slice(0, 1)}
          </AvatarFallback>
        </Avatar>
      </div>

      <div className="flex items-center justify-end">
        {!isSelf && (
          <FollowButton followButtonText={followButtonText} user={paramUser} />
        )}
      </div>

      {!isUpdating && (
        <div className="">
          <Table>
            <TableCaption></TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[140px]">Key</TableHead>
                <TableHead className="text-right">Value</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">
                  <b>Fullname</b>
                </TableCell>
                <TableCell className="text-right">
                  {paramUser.fullname}
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell className="font-medium">
                  <b>Status</b>
                </TableCell>
                <TableCell
                  className={"text-right capitalize font-bold" + " " + color}
                >
                  {paramUser.status}
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell className="font-medium">
                  <b>Bio</b>
                </TableCell>
                <TableCell className="text-right">{paramUser.bio}</TableCell>
              </TableRow>

              <TableRow>
                <TableCell className="font-medium">
                  <b>Date of birth</b>
                </TableCell>
                <TableCell className="text-right">
                  {paramUser.dateOfBirthFormatted.split(" - ")[0]}
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell className="font-medium">
                  <b>Created at</b>
                </TableCell>
                <TableCell className="text-right">
                  {paramUser.createdAtFormatted}
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell className="font-medium">
                  <b>Updated at</b>
                </TableCell>
                <TableCell className="text-right">
                  {paramUser.updatedAtFormatted}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      )}

      {isSelf && !isUpdating && (
        <div className="flex items-center justify-end">
          <Button
            onClick={() => setIsUpdating(true)}
            className=""
            type="button"
            variant={"default"}
            size={"default"}
          >
            Update
          </Button>
        </div>
      )}

      {isUpdating && (
        <>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleUpdateUserInfo)}
              className="space-y-8"
            >
              <FormField
                control={form.control}
                name="fullname"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fullname</FormLabel>
                    <FormControl>
                      <Input type="text" placeholder="Xeza" {...field} />
                    </FormControl>
                    <FormDescription></FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="avatarLink"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Avatar Link</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="https://google.com/beautiful.png"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription></FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* TODO: work on this */}
            </form>
          </Form>

          <div className="flex gap-2 items-center justify-between">
            <Button
              onClick={() => setIsUpdating(false)}
              className=""
              type="button"
              variant={"destructive"}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              className=""
              disabled={isLoading || isError}
              variant={"default"}
            >
              <LoadingWrapper isLoading={isLoading} isError={isError}>
                Confirm
              </LoadingWrapper>
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default UserInfo;
