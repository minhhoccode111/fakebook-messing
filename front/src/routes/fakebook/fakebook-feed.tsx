import { create } from "zustand";
import { Await, defer, userLoaderData } from "react-router-dom";

// export type User = {
//   fullname: string;
//   status: string;
//   avatarLink: string;
// };

// export type Post = {
//   creator: User;
//   content: string;
// };

// export type Connections = {
//   self: User;
//   followers: User[];
//   followings: User[];
//   mayknows: User[];
//   friends: User[];
// };

// export type StateFeedStore = {
//   posts: Post[];
//   followers: User[];
//   followings: User[];
//   mayknows: User[];
//   friends: User[];
// };

// export type ActionFeedStore = {
//   setPosts: (posts: Post[]) => void;
//   setConnections: (connections: Connections) => void;
// };

// export const useFeedStore = create<StateFeedStore & ActionFeedStore>((set) => ({
//   posts: [],
//   followers: [],
//   followings: [],
//   mayknows: [],
//   friends: [],
//   setPosts: (posts: Post[]) => set(() => ({ posts })),
//   setConnections: (connections: Connections) => set(() => ({ ...connections })),
// }));

export const loaderFakebookFeed = async () => {
  return null;
};

const FakebookFeed = () => {
  return <></>;
};

export default FakebookFeed;
