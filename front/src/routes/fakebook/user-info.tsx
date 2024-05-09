import { useState } from "react";
import { useForm, Controller } from "react-hook-form";

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
import { Connections, ConnectionsText, User } from "@/shared/types";
import { useParamUserStore } from "@/routes/fakebook/user-layout";

import MyAvatar from "@/components/custom/my-avatar";
import FollowButton from "@/components/custom/follow-button";
import { useConnectionsFeedStore } from "@/components/custom/connections-feed";
import { Navigate } from "react-router-dom";
import { ApiOrigin } from "@/shared/constants";
import axios from "axios";
import LoadingWrapper from "@/components/custom/loading-wrapper";
import { domParser } from "@/shared/methods";

type UpdateUserInfoDataType = {
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

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdateUserInfoDataType>();

  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  // show or hide update info section
  const [isUpdating, setIsUpdating] = useState(false);

  // if user navigate straight to this route without prepare
  // connectionsFeed data in /feed, navigate them back
  if (!isSelf && !connectionsFeed) return <Navigate to={"/fakebook/feed"} />;

  // console.log(self.fullname);

  const handleUpdateUserInfo = async (data: UpdateUserInfoDataType) => {
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

  return (
    <div className="max-w-[70ch]">
      <div className="grid place-items-center">
        <MyAvatar
          src={paramUser.avatarLink}
          fallback={
            isUpdating
              ? self.fullname.slice(0, 1)
              : paramUser.fullname.slice(0, 1)
          }
        />
      </div>

      {/* TODO: handle follow */}
      <div className="">
        {!isSelf && (
          <FollowButton followButtonText={followButtonText} user={paramUser} />
        )}
      </div>

      {!isUpdating && (
        <div className="">
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
                <TableCell className="text-right">
                  {paramUser.fullname}
                </TableCell>
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
        </div>
      )}

      {isSelf && !isUpdating && (
        <div className="flex justify-end">
          <button
            onClick={() => setIsUpdating(true)}
            className=""
            type="button"
          >
            update
          </button>
        </div>
      )}

      {isUpdating && (
        <form onSubmit={handleSubmit(handleUpdateUserInfo)} className="">
          <label className="">
            <p className="">Fullname: </p>
            <input
              defaultValue={self.fullname}
              {...register("fullname", {
                required: "Fullname is required.",
                minLength: {
                  value: 1,
                  message: "Fullname must be at least 1 character.",
                },
                maxLength: {
                  value: 50,
                  message: "Fullname must be at max 50 characters.",
                },
                validate: (value) =>
                  value.trim().length > 0 ||
                  `Fullname must be at least 1 character.`,
              })}
              aria-invalid={errors.fullname ? "true" : "false"}
              className="invalid:border-red-500"
            />
            {errors.fullname && <p className="">{errors.fullname.message}</p>}
          </label>

          <label className="">
            <p className="">Avatar Link: </p>
            <input
              defaultValue={domParser(self.avatarLink)}
              {...register("avatarLink", {
                required: "Avatar Link is required.",
                minLength: {
                  value: 1,
                  message: "Avatar Link must be at least 1 character.",
                },
                validate: (value) =>
                  value.trim().length > 0 ||
                  `Avatar Link must be at least 1 character.`,
              })}
              aria-invalid={errors.avatarLink ? "true" : "false"}
              className="invalid:border-red-500"
            />
            {errors.avatarLink && (
              <p className="">{errors.avatarLink.message}</p>
            )}
          </label>

          <label className="">
            <p className="">Bio: </p>
            <textarea
              defaultValue={self.bio}
              {...register("bio", {
                required: "Bio must be at least 1 character.",
                minLength: {
                  value: 1,
                  message: "Bio must be at least 1 character.",
                },
                maxLength: {
                  value: 250,
                  message: "Bio must be at max 250 characters",
                },
                validate: (value) =>
                  value.trim().length > 0 ||
                  `Bio must be at least 1 character.`,
              })}
              aria-invalid={errors.bio ? "true" : "false"}
              className="invalid:border-red-500"
            ></textarea>
            {errors.bio && <p className="">{errors.bio.message}</p>}
          </label>

          <label className="">
            <p className="">Date of birth: </p>
            <input
              type="date"
              defaultValue={self.dateOfBirthIso}
              {...register("dateOfBirth")}
            />
          </label>

          {/* Select combine with react hook form */}
          <label className="">
            <p className="">status: </p>
            <Controller
              name="status" // Name of the form field
              control={control} // Instance of the form control
              defaultValue={self.status} // Optional: Set a default value
              rules={{ required: true }} // Optional: Add validation rules
              render={({ field }) => (
                <select {...field}>
                  <option value="online">online</option>
                  <option value="offline">offline</option>
                  <option value="busy">busy</option>
                  <option value="afk">afk</option>
                </select>
              )}
            />
          </label>

          <div className="flex gap-2 items-center justify-between">
            <button
              onClick={() => setIsUpdating(false)}
              className=""
              type="button"
            >
              cancel
            </button>

            <LoadingWrapper isLoading={isLoading} isError={isError}>
              <button type="submit" className="">
                confirm
              </button>
            </LoadingWrapper>
          </div>
        </form>
      )}
    </div>
  );
};

export default UserInfo;
