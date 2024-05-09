import { useForm } from "react-hook-form";
import axios from "axios";
import { useState } from "react";

import { ApiOrigin } from "@/shared/constants";
import LoadingWrapper from "@/components/custom/loading-wrapper";
import { useAuthStore } from "@/main";
import { PostType } from "@/shared/types";

type PostAddDataType = {
  content: string;
};

type PostAddFormPropsType = {
  userPosts: PostType[];
  setUserPosts: (newUserPosts: PostType[]) => void;
};

const PostAddForm = ({ userPosts, setUserPosts }: PostAddFormPropsType) => {
  const {
    reset,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PostAddDataType>();

  const authData = useAuthStore((state) => state.authData);

  const [isError, setIsError] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleAddPost = async (data: PostAddDataType) => {
    try {
      setIsLoading(true);

      const res = await axios({
        url: ApiOrigin + `/users/${authData.self?.id}/posts`,
        method: "post",
        headers: {
          Authorization: `Bearer ${authData.token}`,
        },
        data: {
          ...data,
        },
      });

      // console.log(res.data);

      setUserPosts([{ ...res.data, comments: [], likes: 0 }, ...userPosts]);

      // setIsSuccess(true);
      reset();
    } catch (err: any) {
      console.log(err);

      if (err.response.status !== 400) setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleAddPost)} className="">
      <label className="">
        <p className="">New post: </p>

        <textarea
          placeholder="What's on your mind?"
          {...register("content", {
            required: "Content is required.",
            minLength: {
              value: 1,
              message: "Content must be at least 1 character.",
            },
            maxLength: {
              value: 10000,
              message: "Content must be at max 10000 characters.",
            },
            validate: (value) =>
              value.trim().length > 0 ||
              `Content must be at least 1 character.`,
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

export default PostAddForm;
