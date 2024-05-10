import { useParams } from "react-router-dom";

import useParamUserStore from "@/stores/param-user";
import useAuthStore from "@/stores/auth";

import { PostType, User } from "@/shared/types";
import { useEffect, useState } from "react";

import PostAddForm from "@/components/custom/post-add-form";
import { ApiOrigin } from "@/shared/constants";
import axios from "axios";
import Post from "@/components/custom/post";

const useUserPostsFetcher = () => {
  const { userid } = useParams();

  const authData = useAuthStore((state) => state.authData);
  const selfid = authData.self?.id;

  const isSelf = userid === selfid;

  const [isError, setIsError] = useState(false);
  const [userPosts, setUserPosts] = useState<undefined | PostType[]>();

  useEffect(() => {
    const tmp = async () => {
      try {
        const res = await axios({
          url: ApiOrigin + `/users/${userid}/posts`,
          method: "get",
          headers: {
            Authorization: `Bearer ${authData.token}`,
          },
        });

        // console.log(res.data);

        setUserPosts(res.data.posts);
      } catch (err) {
        setIsError(true);
      }
    };

    tmp();
  }, [authData.token]);

  return { isSelf, isError, userPosts, setUserPosts };
};

const UserPosts = () => {
  const paramUser = useParamUserStore((state) => state.paramUser) as User;

  const { isSelf, isError, userPosts, setUserPosts } = useUserPostsFetcher();

  if (isError) return <div className="">error</div>;
  if (!userPosts) return <div className="">loading</div>;

  return (
    <div className="">
      {/* pass down to update after a new post return */}
      {isSelf && (
        <PostAddForm
          userPosts={userPosts}
          setUserPosts={setUserPosts}
        ></PostAddForm>
      )}

      <ul className="">
        {userPosts.length === 0 && <li className="">No posts yet</li>}
        {userPosts.map((post, index: number) => (
          // get all posts of a user is not populated the creator field
          // because we already knew that user if the posts' creator
          <Post
            key={index}
            isSelf={isSelf}
            allPostsState={userPosts}
            setAllPostsState={setUserPosts}
            post={{ ...post, creator: paramUser }}
          />
        ))}
      </ul>
    </div>
  );
};

export default UserPosts;
