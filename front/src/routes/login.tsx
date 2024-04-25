import axios from "axios";
import { Form, Navigate, useActionData } from "react-router-dom";
import { ActionFunction } from "react-router-dom";
import EnvVar from "@/shared/constants";
import { useEffect, useRef, useState } from "react";
const { ApiOrigin } = EnvVar;

type LoginState = {
  isLoading: boolean;
  isError: boolean;
  isSuccess: boolean;
};

export const action: ActionFunction = async ({
  request,
  // params
}) => {
  const formData = await request.formData();
  const username = formData.get("username");
  const password = formData.get("password");

  let isLoading = false;
  let isError = false;
  let isSuccess = false;

  try {
    isLoading = true;

    const res = await axios({
      // mode: "cors", // don't know why typescript not allows this
      method: "post",
      url: ApiOrigin + "/auth/login",
      data: {
        username,
        password,
      },
    });

    console.log(res);
    isSuccess = true;
  } catch (err) {
    console.log(err);
    isError = true;
  } finally {
    isLoading = false;
  }

  console.log(`login action post`);

  return { isLoading, isError, isSuccess };
};

type LoginStatus = "login" | "loading" | "error" | "success";
type LoginData = {
  username: string;
  password: string;
};

const useLogin = async () => {
  const [loginStatus, setStatus] = useState<LoginStatus>("login");
  const [loginData, setLoginData] = useState<LoginData>({
    username: "",
    password: "",
  });

  useEffect(() => {
    //
  }, [loginData]);

  return { loginStatus, setLoginData };
};

export default function Login() {
  const { loginStatus, setLoginData } = useLogin();
  const usernameRef = useRef(null);
  const passwordRef = useRef(null);

  if (loginStatus === "success") return <Navigate to={"/fakebook"} />;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log(`login post.`);
  };

  return (
    <Form onSubmit={handleLogin} className="">
      <input ref={usernameRef} name="username" type="text" className="" />
      <input ref={passwordRef} name="password" type="text" className="" />
      <button type="submit" className="">
        {loginStatus}
      </button>
    </Form>
  );
}
