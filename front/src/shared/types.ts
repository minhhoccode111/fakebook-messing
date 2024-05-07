export type User = {
  fullname: string;
  status: string;
  bio: string;
  avatarLink: string;
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
