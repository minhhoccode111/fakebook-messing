import axios from "axios";
import { Form, Navigate } from "react-router-dom";
import { useState } from "react";
import { useForm } from "react-hook-form";

import EnvVar from "@/shared/constants";
const { ApiOrigin } = EnvVar;

// This type will be called with `useForm` and `handleSubmit`
type SignupData = {
  fullname: string;
  username: string;
  password: string;
  "confirm-password": string;
};

const Signup = () => {
  const {
    watch,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupData>();

  const password = watch("password");

  const [isError, setIsError] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [isConflict, setIsConflict] = useState<boolean>(false);

  const handleSignup = async (data: SignupData) => {
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

      // TODO: try to add err types AxiosError
      if (err.response.status === 409) setIsConflict(true);
      else if (err.response.status !== 400) setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  // console.log(`isLoading: `, isLoading);
  // console.log(`isError: `, isError);
  // console.log(`isSuccess: `, isSuccess);
  // console.log(`isConflict: `, isConflict);
  // console.log(errors);

  if (isSuccess) return <Navigate to={"/login"} />;

  return (
    <Form onSubmit={handleSubmit(handleSignup)} className="">
      <h2 className="">Please sign up</h2>
      <label className="">
        <p className="">Fullname: </p>
        <input
          {...register("fullname", {
            required: "Fullname is required.",
            minLength: {
              value: 1,
              message: "Fullname must be at least 1 character.",
            },
            maxLength: {
              value: 50,
              message: "Fullname must be at max 50 characters.",
            },
            validate: (value) =>
              value.trim().length > 0 ||
              `Fullname must be at least 1 character.`,
          })}
          aria-invalid={errors.fullname ? "true" : "false"}
          className="invalid:border-red-500"
        />
        {errors.fullname && <p className="">{errors.fullname.message}</p>}
      </label>

      <label className="">
        <p className="">Username: </p>
        <input
          type="email"
          {...register("username", {
            required: `Username is required.`,
            minLength: {
              value: 8,
              message: "Username must be at least 8 characters.",
            },
            pattern: {
              value: /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/g,
              message: `Username must be a valid email.`,
            },
          })}
          aria-invalid={errors.username ? "true" : "false"}
          className="invalid:border-red-500"
        />
        {errors.username && <p className="">{errors.username.message}</p>}
      </label>

      <label className="">
        <p className="">Password: </p>
        <input
          type="password"
          {...register("password", {
            required: `Password is required.`,
            minLength: {
              value: 8,
              message: `Password must be at least 8 characters.`,
            },
            maxLength: {
              value: 32,
              message: `Password must be at max 32 characters.`,
            },
            pattern:
              // strong password pattern
              {
                value:
                  /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,32}$/,
                message:
                  "Password must contain at least 1 uppercase, 1 lowercase, 1 number, 1 special character.",
              },
          })}
          aria-invalid={errors.password ? "true" : "false"}
          className="invalid:border-red-500"
        />
        {errors.password && <p className="">{errors.password.message}</p>}
      </label>

      <label className="">
        <p className="">Confirm password: </p>
        <input
          type="password"
          {...register("confirm-password", {
            required: `Confirm password is required.`,
            validate: (value) =>
              value === password || `Confirm password does not match.`,
          })}
          aria-invalid={errors["confirm-password"] ? "true" : "false"}
          className="invalid:border-red-500"
        />
        {errors["confirm-password"] && (
          <p className="">{errors["confirm-password"].message}</p>
        )}
      </label>

      {isConflict && <p className="">That username is already existed.</p>}

      <div className="">
        <button type="submit" className="">
          {/*  TODO: display proper icons and disable button when error happens */}
          {isError ? "error" : isLoading ? "loading..." : "signup"}
        </button>
      </div>
    </Form>
  );
};

export default Signup;
