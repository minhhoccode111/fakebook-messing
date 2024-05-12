export type UserStatus = "online" | "offline" | "busy" | "afk";

export type User = {
  id: string;
  bio: string;
  fullname: string;
  status: UserStatus;
  avatarLink: string;
  dateOfBirthIso: string;
  createdAtFormatted: string;
  updatedAtFormatted: string;
  dateOfBirthFormatted: string;
};

export type PostType = {
  id: string;
  creator: User;
  likes: number;
  content: string;
  commentsLength: number;
  comments: CommentType[];
  createdAtFormatted: string;
};

export type CommentType = {
  id: string;
  creator: User;
  likes: number;
  content: string;
  createdAtFormatted: string;
};

export type ConnectionsText =
  | "mayknows"
  | "friends"
  | "followers"
  | "followings";

export type Connections = {
  self: User;
  friends: User[];
  mayknows: User[];
  followers: User[];
  followings: User[];
};
