import axios from "axios";
import useAuthStore from "@/stores/auth";
import { ApiOrigin } from "@/shared/constants";
import { CommentType, PostType } from "@/shared/types";

import LoadingWrapper from "@/components/custom/loading-wrapper";

import DangerHtml from "@/components/custom/danger-html";
import Connection from "@/components/custom/connection";
import { Button } from "@/components/ui/button";

type CommentPropsType = {
  comment: CommentType;

  creatorid: string;
  post: PostType;

  isLoading: boolean;
  setIsLoading: (newState: boolean) => void;
  isError: boolean;
  setIsError: (newState: boolean) => void;

  setIsShowLess: (newState: boolean) => void;
  setIsFetchedFull: (newState: boolean) => void;

  allPostsState: PostType[];
  setAllPostsState: (newAllPostsState: PostType[]) => void;
};

const Comment = ({
  post,
  comment,
  creatorid,

  // use the same loading state with post
  isError,
  setIsError,
  isLoading,
  setIsLoading,

  // only fetch all once
  setIsFetchedFull,
  // toggle expand of a post
  setIsShowLess,

  // update all post state when new data is returned based on the state pass
  // down by parent component for reusability
  // between postsFeed global store at /feed and postsUser at /profile/users
  allPostsState,
  setAllPostsState,
}: CommentPropsType) => {
  const { likes, creator, content } = comment;

  const authData = useAuthStore((state) => state.authData);

  const handleLikeComment = async () => {
    try {
      setIsLoading(true);
      const res = await axios({
        method: "post",
        url:
          ApiOrigin +
          `/users/${creatorid}/posts/${post.id}/comments/${comment.id}/likes`,
        headers: {
          Authorization: `Bearer ${authData.token}`,
        },
      });

      // console.log(res.data);

      const responsePost = res.data;
      const newPost = Object.assign({}, post, responsePost); // merge
      const newPostsFeed = allPostsState.map((p) =>
        p.id === post.id ? newPost : p,
      );
      setAllPostsState(newPostsFeed);

      setIsShowLess(false);

      setIsFetchedFull(true);
    } catch (err) {
      console.error(err);

      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <li className="">
      <Connection isAllowActions={false} user={creator} />

      <div className="">
        <DangerHtml content={content}></DangerHtml>
      </div>

      <p className="font-bold flex items-center">
        <LoadingWrapper isLoading={isLoading} isError={isError}>
          <Button
            onClick={handleLikeComment}
            className=""
            variant={"outline"}
            size={"sm"}
          >
            {likes} likes
          </Button>
        </LoadingWrapper>
      </p>
    </li>
  );
};

export default Comment;
