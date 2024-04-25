import axios from "axios";
import { Form, Navigate } from "react-router-dom";
import { useRef, useState } from "react";
import { useAuthStore } from "@/main";

import EnvVar from "@/shared/constants";
const { ApiOrigin } = EnvVar;

type LoginStatus = "ready" | "loading" | "error" | "success";

const Login = () => {
  const [loginStatus, setLoginStatus] = useState<LoginStatus>("ready");
  const setAuthData = useAuthStore((state) => state.setAuthData);

  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const username = usernameRef.current?.value;
    const password = passwordRef.current?.value;

    try {
      setLoginStatus("loading");

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

      setLoginStatus("success");
    } catch (err) {
      console.log(err);
      setLoginStatus("error");
    }
  };

  console.log(`loginStatus belike: `, loginStatus);

  if (loginStatus === "success") return <Navigate to={"/fakebook"} />;

  return (
    <Form onSubmit={handleLogin} className="">
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
          {loginStatus}
        </button>
      </div>
    </Form>
  );
};

export default Login;
