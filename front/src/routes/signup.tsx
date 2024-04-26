import axios from "axios";
import { Form, Navigate } from "react-router-dom";
import { useRef, useState } from "react";

import EnvVar from "@/shared/constants";
const { ApiOrigin } = EnvVar;

const Signup = () => {
  const [isError, setIsError] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  // type pass to this specify which element this ref will be used on
  const fullnameRef = useRef<HTMLInputElement>(null);
  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const confirmPasswordRef = useRef<HTMLInputElement>(null);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    const fullname = fullnameRef.current?.value;
    const username = usernameRef.current?.value;
    const password = passwordRef.current?.value;
    const confirmPassword = confirmPasswordRef.current?.value;

    try {
      setIsLoading(true);

      const res = await axios({
        // mode: 'cors',

        url: ApiOrigin + "/auth/signup",
        method: "post",
        data: {
          fullname,
          username,
          password,
          "confirm-password": confirmPassword,
        },
      });

      console.log(res);

      setIsSuccess(true);
    } catch (err) {
      console.log(err);

      // TODO: try to add err types AxiosError
      if (err.response.status !== 400) setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  // console.log(`isLoading: `, isLoading);
  // console.log(`isError: `, isError);
  // console.log(`isSuccess: `, isSuccess);

  if (isSuccess) return <Navigate to={"/login"} />;

  return (
    <Form onSubmit={handleSignup} className="">
      <h2 className="">Please sign up</h2>
      <label className="">
        <p className="">Fullname: </p>
        <input ref={fullnameRef} name="fullname" type="text" className="" />
      </label>

      <label className="">
        <p className="">Username: </p>
        <input ref={usernameRef} name="username" type="text" className="" />
      </label>

      <label className="">
        <p className="">Password: </p>
        <input ref={passwordRef} name="password" type="text" className="" />
      </label>

      <label className="">
        <p className="">Confirm password: </p>
        <input
          ref={confirmPasswordRef}
          name="confirmPassword"
          type="text"
          className=""
        />
      </label>

      <div className="">
        <button type="submit" className="">
          {/*  TODO: display proper icons and disable button when error happens */}
          {isError ? "error" : isLoading ? "loading" : "signup"}
        </button>
      </div>
    </Form>
  );
};

export default Signup;
