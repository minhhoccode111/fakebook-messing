import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useState } from "react";
import axios from "axios";
import { z } from "zod";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { ApiOrigin, NumberRandomUsers } from "@/shared/constants";
import { LoginFormData } from "@/shared/forms";
import useAuthStore from "@/stores/auth";

import LoadingWrapper from "@/components/custom/loading-wrapper";

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
    <div className="container">
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
              <Button variant={"default"}>
                <Link to={"/signup"}>Signup</Link>
              </Button>{" "}
              now
            </div>

            <div className="flex gap-2 items-center justify-between">
              <Button
                variant={"destructive"}
                type="button"
                onClick={() => form.reset()}
              >
                Clear
              </Button>

              <LoadingWrapper isLoading={isLoading} isError={isError}>
                <Button variant={"default"} type="submit">
                  Login
                </Button>
              </LoadingWrapper>
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
        <div className="flex gap-2 justify-end items-center">
          Or login
          <LoadingWrapper isLoading={isLoading} isError={isError}>
            <Button variant={"default"} type="submit">
              Random
            </Button>
          </LoadingWrapper>
        </div>
      </form>
    </div>
  );
};

export default Login;
