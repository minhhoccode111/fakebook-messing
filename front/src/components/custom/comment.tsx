import axios from "axios";
import { useAuthStore } from "@/main";
import { ApiOrigin } from "@/shared/constants";
import { PostType, CommentType } from "@/shared/types";

import MyAvatar from "@/components/custom/my-avatar";
import LoadingWrapper from "@/components/custom/loading-wrapper";

type CommentPropsType = {
  comment: CommentType;

  creatorid: string;
  postid: string;

  localPost: PostType;
  setLocalPost: (current: PostType) => void;

  isLoading: boolean;
  setIsLoading: (newState: boolean) => void;
  isError: boolean;
  setIsError: (newState: boolean) => void;

  setIsShowLess: (newState: boolean) => void;
  setIsFetchedFull: (newState: boolean) => void;
};

const Comment = ({
  postid,
  comment,
  creatorid,

  // to set local post after we like a post
  setLocalPost,
  localPost,

  // use the same loading state with post
  isError,
  setIsError,
  isLoading,
  setIsLoading,

  setIsFetchedFull,
  setIsShowLess,
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
          `/users/${creatorid}/posts/${postid}/comments/${comment.id}/likes`,
        headers: {
          Authorization: `Bearer ${authData.token}`,
        },
      });

      const responsePost = res.data;
      console.log(responsePost);

      setLocalPost({ ...localPost, ...responsePost });

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
    // TODO: add markdown parser
    <li>
      <div className="">
        <p className="">{creator.fullname}</p>

        <MyAvatar
          src={creator.avatarLink}
          fallback={creator.fullname.charAt(0)}
        />
      </div>

      <div className="">
        <p className="">{content}</p>
      </div>

      <div className="">
        <p className="font-bold flex items-center">
          <LoadingWrapper isLoading={isLoading} isError={isError}>
            <button onClick={handleLikeComment} className="text-xl">
              ^
            </button>
          </LoadingWrapper>

          <span className="">{likes}</span>
        </p>
      </div>
    </li>
  );
};

export default Comment;
