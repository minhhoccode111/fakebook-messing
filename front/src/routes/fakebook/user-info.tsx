import { zodResolver } from "@hookform/resolvers/zod";
import { Navigate } from "react-router-dom";
import { CalendarIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { format } from "date-fns";
import { useState } from "react";
import axios from "axios";
import { z } from "zod";

import { cn } from "@/lib/utils";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar } from "@/components/ui/calendar";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import LoadingWrapper from "@/components/custom/loading-wrapper";
import FollowButton from "@/components/custom/follow-button";

import useConnectionsFeedStore from "@/stores/connections-feed";
import useParamUserStore from "@/stores/param-user";
import useAuthStore from "@/stores/auth";

import { Connections, ConnectionsText, User } from "@/shared/types";
import { UserInfoFormData } from "@/shared/forms";
import { ApiOrigin } from "@/shared/constants";
import { domParser } from "@/shared/methods";

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
      dateOfBirth: new Date(paramUser.dateOfBirthIso),
      avatarLink: domParser(paramUser.avatarLink),
    },
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  // show or hide update info section
  const [isUpdating, setIsUpdating] = useState(false);

  // if user navigate straight to this route without prepare
  // connectionsFeed data in /feed, navigate them back
  if (!isSelf && !connectionsFeed) return <Navigate to={"/fakebook/feed"} />;

  const handleUpdateUserInfo = async (
    data: z.infer<typeof UserInfoFormData>,
  ) => {
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
                name="dateOfBirth"
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-1">
                    <FormLabel>Date of birth</FormLabel>
                    <FormControl className="">
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-[280px] justify-start text-left font-normal",
                              !field.value && "text-muted-foreground",
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
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

              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bio</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Never gonna give you up..."
                        {...field}
                      ></Textarea>
                    </FormControl>
                    <FormDescription></FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Select a status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Status</SelectLabel>
                          <SelectItem value="online">Online</SelectItem>
                          <SelectItem value="offline">Offline</SelectItem>
                          <SelectItem value="busy">Busy</SelectItem>
                          <SelectItem value="afk">AFK</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    <FormDescription></FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

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
            </form>
          </Form>
        </>
      )}
    </div>
  );
};

export default UserInfo;
