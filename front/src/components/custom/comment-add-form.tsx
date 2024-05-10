import { useForm } from "react-hook-form";
import { PostType } from "@/shared/types";
import axios from "axios";
import { ApiOrigin } from "@/shared/constants";
import useAuthStore from "@/stores/auth";
import LoadingWrapper from "@/components/custom/loading-wrapper";

type CommentAddDataType = {
  content: string;
};

type CommentAddFormPropsType = {
  creatorid: string;
  post: PostType;

  isLoading: boolean;
  setIsLoading: (newState: boolean) => void;
  isError: boolean;
  setIsError: (newState: boolean) => void;

  allPostsState: PostType[];
  setAllPostsState: (newAllPostsState: PostType[]) => void;
};

const CommentAddForm = ({
  post,
  creatorid,

  // use the same loading state with post
  isError,
  setIsError,
  isLoading,
  setIsLoading,

  allPostsState,
  setAllPostsState,
}: CommentAddFormPropsType) => {
  const authData = useAuthStore((state) => state.authData);

  const {
    reset,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CommentAddDataType>();

  const handleAddComment = async (data: CommentAddDataType) => {
    const url = ApiOrigin + `/users/${creatorid}/posts/${post.id}/comments`;

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

      // console.log(res.data);

      const responsePost = res.data;
      const newPost = Object.assign({}, post, responsePost); // merge
      const newPostsFeed = allPostsState.map((p) =>
        p.id === post.id ? newPost : p,
      );
      setAllPostsState(newPostsFeed);

      reset();
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
          <button onClick={() => reset()} type="button" className="">
            clear
          </button>
        </LoadingWrapper>

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
