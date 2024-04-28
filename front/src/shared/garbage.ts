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

// export type Post = {
//   creator: User;
//   content: string;
// };

// export type User = {
//   fullname: string;
//   status: string;
//   avatarLink: string;
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
