import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useState } from "react";
import axios from "axios";
import { z } from "zod";

import {
  Form,
  FormItem,
  FormLabel,
  FormField,
  FormMessage,
  FormControl,
  FormDescription,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { ApiOrigin, NumberRandomUsers } from "@/shared/constants";
import { LoginFormData } from "@/shared/forms";

import useAuthStore from "@/stores/auth";

import LoadingWrapper from "@/components/custom/loading-wrapper";
import RouteHeader from "@/components/custom/route-header";

const Login = () => {
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof LoginFormData>>({
    resolver: zodResolver(LoginFormData),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isWrong, setIsWrong] = useState(false);

  const setAuthData = useAuthStore((state) => state.setAuthData);

  const handleLoginRandom = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setIsLoading(true);

      // from 0 to 20 random accounts to use
      const random = Math.floor(Math.random() * Number(NumberRandomUsers));

      const username = "asd" + random;
      const password = "asd";

      const res = await axios({
        url: ApiOrigin + "/auth/login",
        method: "post",
        data: {
          username,
          password,
        },
      });

      // console.log(res.data);

      setAuthData(res.data);

      setIsLoading(false);

      navigate("/fakebook");
    } catch (err) {
      console.log(err);

      setIsError(true);
    }
  };

  const handleLogin = async (data: z.infer<typeof LoginFormData>) => {
    try {
      setIsLoading(true);

      const res = await axios({
        url: ApiOrigin + "/auth/login",
        method: "post",
        data: {
          ...data,
        },
      });

      // console.log(res);

      setAuthData(res.data);

      setIsLoading(false);

      navigate("/fakebook");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.log(err);

      // if not data error or incorrect username and password
      if (err.response.status !== 400 && err.response.status !== 401) {
        setIsError(true);
      } else {
        // reset form inputs to prevent spam
        form.reset();

        setIsWrong(true);

        setIsLoading(false);
      }
    }
  };

  return (
    <div className="w-full max-w-screen-sm mx-auto">
      <RouteHeader>Login</RouteHeader>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleLogin)} className="space-y-8">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="asd@gmail.com" {...field} />
                </FormControl>
                <FormDescription></FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Super secret password..."
                    {...field}
                  />
                </FormControl>
                <FormDescription></FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex gap-2 items-center justify-between">
            <div className="">
              No account?{" "}
              <Link
                to={"/signup"}
                className="text-sky-500 underline-offset-2 hover:underline"
              >
                Signup
              </Link>{" "}
              now.
            </div>

            <div className="flex gap-2 items-center justify-between">
              <Button
                variant={"destructive"}
                onClick={() => form.reset()}
                type="button"
                size={"sm"}
              >
                Clear
              </Button>

              <Button
                disabled={isError || isLoading}
                variant={"default"}
                type="submit"
                size={"sm"}
              >
                <LoadingWrapper isLoading={isLoading} isError={isError}>
                  Login
                </LoadingWrapper>
              </Button>
            </div>
          </div>
        </form>
      </Form>

      {isWrong && (
        <p className="text-danger text-right my-2">
          Username or password incorrect.
        </p>
      )}

      <form onSubmit={handleLoginRandom} className="my-2">
        <p className={"flex items-center gap-2"}>
          Or login as{" "}
          <button
            type="submit"
            className="text-sky-500 underline-offset-2 hover:underline inline-flex items-center justify-center"
            disabled={isLoading || isError}
          >
            <LoadingWrapper isLoading={isLoading} isError={isError}>
              guess
            </LoadingWrapper>
          </button>
        </p>
      </form>
    </div>
  );
};

export default Login;
