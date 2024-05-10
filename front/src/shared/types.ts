export type User = {
  fullname: string;
  status: string;
  bio: string;
  avatarLink: string;
  id: string;
  createdAtFormatted: string;
  updatedAtFormatted: string;
  dateOfBirthFormatted: string;
  dateOfBirthIso: string;
};

export type PostType = {
  content: string;
  creator: User;
  comments: CommentType[];
  commentsLength: number;
  likes: number;
  createdAtFormatted: string;
  id: string;
};

export type CommentType = {
  creator: User;
  likes: number;
  content: string;
  createdAtFormatted: string;
  id: string;
};

export type ConnectionsText =
  | "friends"
  | "followers"
  | "followings"
  | "mayknows";

export type Connections = {
  self: User;
  friends: User[];
  followers: User[];
  followings: User[];
  mayknows: User[];
};
