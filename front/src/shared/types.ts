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
};

export type CommentType = {
  creator: User;
  likes: number;
  content: string;
  createdAtFormatted: string;
};

export type ConnectionsLabel =
  | "friends"
  | "followers"
  | "followings"
  | "mayknows";

export type Connections = {
  self?: User;
  friends: User[];
  followers: User[];
  followings: User[];
  mayknows: User[];
};

export type StateConnectionsFeedStore = {
  connectionsFeed: Connections;
};

export type ActionConnectionsFeedStore = {
  setConnectionsFeed: (newConnections: Connections) => void;
};

export type StatePostsFeedStore = {
  postsFeed: PostType[];
};

export type ActionPostsFeedStore = {
  setPostsFeed: (newPosts: PostType[]) => void;
};
