import axios from "axios";
import { Navigate } from "react-router-dom";
import { useState } from "react";
import { useAuthStore } from "@/main";
import { useForm } from "react-hook-form";

type LoginFormData = {
  username: string;
  password: string;
};

import { ApiOrigin } from "@/shared/constants";

const Login = () => {
  const { register, handleSubmit, reset } = useForm<LoginFormData>();

  const [isError, setIsError] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  const setAuthData = useAuthStore((state) => state.setAuthData);

  const handleLogin =
    (type = "normal") =>
    async (data: LoginFormData) => {
      let username;
      let password;

      if (type === "normal") {
        // manually validate because if we use react-hook-form to do so
        // then the login random account button won't work as expect
        // because it also trigger form validation and
        // we have to split it into 2 different submit handler
        if (data.username.trim().length < 3 || data.password.trim().length < 3)
          return;
        username = data.username;
        password = data.password;
      } else if (type === "random") {
        // default account, check db populate script in backend
        username = "asd" + Math.floor(Math.random() * 15);
        password = "asd";
      }

      try {
        setIsLoading(true);

        const res = await axios({
          // mode: 'cors',

          url: ApiOrigin + "/auth/login",
          method: "post",
          data: {
            username,
            password,
          },
        });

        // console.log(res);

        setAuthData(res.data);

        setIsSuccess(true);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        console.log(err);

        // TODO: try to add err types AxiosError
        if (err.response.status !== 400 && err.response.status !== 401)
          setIsError(true);
      } finally {
        setIsLoading(false);

        // reset form inputs to prevent spam
        reset({ username: "", password: "" });
      }
    };

  // console.log(`isLoading: `, isLoading);
  // console.log(`isError: `, isError);
  // console.log(`isSuccess: `, isSuccess);

  if (isSuccess) return <Navigate to={"/fakebook"} />;

  return (
    <>
      <form onSubmit={handleSubmit(handleLogin("normal"))} className="">
        <h2 className="">Please log in</h2>
        <label className="">
          <p className="">Username: </p>
          <input {...register("username")} className="" />
        </label>

        <label className="">
          <p className="">Password: </p>
          <input type="password" {...register("password")} className="" />
        </label>

        <div className="">
          <button type="submit" className="">
            {/*  TODO: display proper icons and disable button when error happens */}
            {isError ? "error" : isLoading ? "loading..." : "login"}
          </button>
        </div>
      </form>
      <form onSubmit={handleSubmit(handleLogin("random"))} className="">
        <div className="">
          <button type="submit" className="">
            {/*  TODO: display proper icons and disable button when error happens */}
            {isError
              ? "error"
              : isLoading
                ? "loading..."
                : "use random account"}
          </button>
        </div>
      </form>
    </>
  );
};

export default Login;
