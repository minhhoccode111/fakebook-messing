import { useForm } from "react-hook-form";
import axios from "axios";
import { useState } from "react";

import { ApiOrigin } from "@/shared/constants";

type NewPostData = {
  content: string;
};

const NewPostFeed = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<NewPostData>();

  const [isError, setIsError] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  const handleNewPost = async (data: NewPostData) => {
    try {
      setIsLoading(true);

      const res = await axios({
        // mode: 'cors',

        url: ApiOrigin + "/auth/signup",
        method: "post",
        data: {
          ...data,
        },
      });

      console.log(res);

      setIsSuccess(true);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.log(err.response);

      if (err.response.status !== 400) setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="">
      <p className="">What's in your mind?</p>

      <form onSubmit={handleSubmit(handleNewPost)} className="">
        <label className="">
          <p className="">Content: </p>
          <textarea
            {...register("content", {
              required: `Content is required`,
            })}
            aria-invalid={errors.content ? "true" : "false"}
            className="invalid:border-red-500"
          ></textarea>
          {errors.content && <p className="">{errors.content.message}</p>}
        </label>
      </form>
    </div>
  );
};

export default NewPostFeed;
