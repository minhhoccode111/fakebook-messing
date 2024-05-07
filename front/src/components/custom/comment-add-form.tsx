import { useForm } from "react-hook-form";
import { PostType } from "@/shared/types";
import axios from "axios";
import { ApiOrigin } from "@/shared/constants";
import { useAuthStore } from "@/main";
import LoadingWrapper from "./loading-wrapper";

type CommentAddDataType = {
  content: string;
};

type CommentAddFormPropsType = {
  creatorid: string;
  postid: string;
  localPost: PostType;
  setLocalPost: (current: PostType) => void;

  isLoading: boolean;
  setIsLoading: (newState: boolean) => void;
  isError: boolean;
  setIsError: (newState: boolean) => void;
};

const CommentAddForm = ({
  postid,
  creatorid,

  // to set local post after we like a post
  setLocalPost,
  localPost,

  // use the same loading state with post
  isError,
  setIsError,
  isLoading,
  setIsLoading,
}: CommentAddFormPropsType) => {
  const authData = useAuthStore((state) => state.authData);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CommentAddDataType>();

  const handleAddComment = async (data: CommentAddDataType) => {
    const url = ApiOrigin + `/users/${creatorid}/posts/${postid}/comments`;

    try {
      setIsLoading(true);

      const res = await axios({
        url,
        method: "post",
        headers: {
          Authorization: `Bearer ${authData.token}`,
        },
        data: { ...data }, // only content field
      });

      const responsePost = res.data;

      console.log(responsePost);

      setLocalPost({ ...localPost, ...responsePost });
    } catch (err) {
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleAddComment)} className="">
      <label className="">
        <p className="">Comment: </p>
        <textarea
          {...register("content", {
            required: `Comment cannot be empty`,
          })}
          aria-invalid={errors.content ? "true" : "false"}
          className="invalid:border-red-500"
        ></textarea>
        {errors.content && <p className="">{errors.content.message}</p>}
      </label>

      <div className="">
        <LoadingWrapper isLoading={isLoading} isError={isError}>
          <button type="submit" className="">
            send
          </button>
        </LoadingWrapper>
      </div>
    </form>
  );
};

export default CommentAddForm;
