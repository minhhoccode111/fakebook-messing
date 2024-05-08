export type User = {
  fullname: string;
  status: string;
  bio: string;
  avatarLink: string;
  id: string;
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

export type ConnectionsLabel =
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

export type StateParamUserStore = {
  paramUser: undefined | User;
};
export type ActionParamUserStore = {
  setParamUser: (newUser: User) => void;
};

export type StateConnectionsFeedStore = {
  connectionsFeed: undefined | Connections;
};

export type ActionConnectionsFeedStore = {
  setConnectionsFeed: (newConnections: Connections) => void;
};

export type StatePostsFeedStore = {
  postsFeed: undefined | PostType[];
};

export type ActionPostsFeedStore = {
  setPostsFeed: (newPosts: PostType[]) => void;
};
