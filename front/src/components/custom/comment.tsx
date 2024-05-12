import axios from "axios";

import useAuthStore from "@/stores/auth";

import LoadingWrapper from "@/components/custom/loading-wrapper";
import DangerHtml from "@/components/custom/danger-html";
import Connection from "@/components/custom/connection";

import { Button } from "@/components/ui/button";

import { CommentType, PostType } from "@/shared/types";
import { ApiOrigin } from "@/shared/constants";

type CommentPropsType = {
  comment: CommentType;
  creatorid: string;
  post: PostType;

  setIsLoading: (newState: boolean) => void;
  isLoading: boolean;

  setIsError: (newState: boolean) => void;
  isError: boolean;

  setIsFetchedFull: (newState: boolean) => void;
  setIsShowLess: (newState: boolean) => void;

  setAllPostsState: (newAllPostsState: PostType[]) => void;
  allPostsState: PostType[];
};

const Comment = ({
  post,
  comment,
  creatorid,

  isError,
  setIsError,

  isLoading,
  setIsLoading,

  // toggle expand of a post
  setIsShowLess,

  // only fetch all once
  setIsFetchedFull,

  // update all post state when new data is returned based on the state pass
  // down by parent component for reusability
  // between postsFeed global store at /feed and postsUser at /profile/users
  allPostsState,
  setAllPostsState,
}: CommentPropsType) => {
  const { likes, creator, content, createdAtFormatted } = comment;

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
      // merge responsed one with the old one
      const newPost = Object.assign({}, post, responsePost);
      // update old state with new one
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
    <>
      <Connection isAllowActions={false} user={creator} />

      <div className="pl-12">
        <div className="flex flex-col gap-4 py-4">
          <DangerHtml content={content}></DangerHtml>

          <p className="self-end italic text-xs">{createdAtFormatted}</p>
        </div>

        <div className="font-bold flex items-center justify-end">
          <Button
            onClick={handleLikeComment}
            className=""
            variant={"outline"}
            size={"sm"}
            disabled={isError || isLoading}
          >
            <LoadingWrapper isLoading={isLoading} isError={isError}>
              {likes} likes
            </LoadingWrapper>
          </Button>
        </div>
      </div>
    </>
  );
};

export default Comment;
