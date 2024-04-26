import axios, { AxiosError } from "axios";
import { Form, Navigate } from "react-router-dom";
import { useRef, useState } from "react";
import { useAuthStore } from "@/main";

import EnvVar from "@/shared/constants";
const { ApiOrigin } = EnvVar;

const Login = () => {
  const [isError, setIsError] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  const setAuthData = useAuthStore((state) => state.setAuthData);

  // type pass to this specify which element this ref will be used on
  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const username = usernameRef.current?.value;
    const password = passwordRef.current?.value;

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
    } catch (err) {
      console.log(err);

      // TODO: try to add err types AxiosError
      if (err.response.status !== 400 && err.response.status !== 401)
        setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  // console.log(`isLoading: `, isLoading);
  // console.log(`isError: `, isError);
  // console.log(`isSuccess: `, isSuccess);

  if (isSuccess) return <Navigate to={"/fakebook"} />;

  return (
    <Form onSubmit={handleLogin} className="">
      <h2 className="">Please log in</h2>
      <label className="">
        <p className="">Username: </p>
        <input ref={usernameRef} name="username" type="text" className="" />
      </label>

      <label className="">
        <p className="">Password: </p>
        <input ref={passwordRef} name="password" type="text" className="" />
      </label>

      <div className="">
        <button type="submit" className="">
          {/*  TODO: display proper icons and disable button when error happens */}
          {isError ? "error" : isLoading ? "loading" : "login"}
        </button>
      </div>
    </Form>
  );
};

export default Login;
