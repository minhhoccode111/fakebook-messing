export type User = {
  fullname: string;
  status: string;
  bio: string;
  avatarLink: string;
  id: string;
};

export type Post = {
  content: string;
  creator: User;
  comments: Comment[];
  likes: number;
  createdAtFormatted: string;
};

export type Comment = {
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
