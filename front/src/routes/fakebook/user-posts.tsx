import { useParams } from "react-router-dom";

import { useParamUserStore } from "@/routes/fakebook/user-layout";
import { useAuthStore } from "@/main";

import { PostType, User } from "@/shared/types";
import { useEffect, useState } from "react";

import PostAddForm from "@/components/custom/post-add-form";
import { ApiOrigin } from "@/shared/constants";
import axios from "axios";
import Post from "@/components/custom/post";

const useUserPostsFetcher = () => {
  const { userid } = useParams();

  const token = useAuthStore((state) => state.authData.token);

  const [isError, setIsError] = useState(false);
  const [userPosts, setUserPosts] = useState<undefined | PostType[]>();

  useEffect(() => {
    const tmp = async () => {
      try {
        const res = await axios({
          url: ApiOrigin + `/users/${userid}/posts`,
          method: "get",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // console.log(res.data);

        setUserPosts(res.data.posts);
      } catch (err) {
        setIsError(true);
      }
    };

    tmp();
  }, [token]);

  return { isError, userPosts, setUserPosts };
};

const UserPosts = () => {
  // identify authorization of current profile
  const { self } = useAuthStore((state) => state.authData);
  const paramUser = useParamUserStore((state) => state.paramUser) as User;
  const isSelf = paramUser?.id === self?.id;

  const { isError, userPosts, setUserPosts } = useUserPostsFetcher();

  if (isError) return <div className="">error</div>;
  if (!userPosts) return <div className="">loading</div>;

  return (
    <div className="">
      {/* TODO: check and add create new post form */}
      {isSelf && <PostAddForm></PostAddForm>}

      <ul className="">
        {userPosts.map((post, index: number) => (
          // get all posts of a user is not populated the creator field
          // because we already knew that user if the posts' creator
          <Post
            key={index}
            post={{ ...post, creator: paramUser }}
            allPostsState={userPosts}
            setAllPostsState={setUserPosts}
          />
        ))}
      </ul>
    </div>
  );
};

export default UserPosts;
