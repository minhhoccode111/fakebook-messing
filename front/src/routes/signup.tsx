import { zodResolver } from "@hookform/resolvers/zod";
import { Link, Navigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useState } from "react";
import axios from "axios";
import { z } from "zod";

import { SignupFormDataSchema } from "@/shared/forms";
import { ApiOrigin } from "@/shared/constants";

import LoadingWrapper from "@/components/custom/loading-wrapper";

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

const Signup = () => {
  const form = useForm<z.infer<typeof SignupFormDataSchema>>({
    resolver: zodResolver(SignupFormDataSchema),
    defaultValues: {
      fullname: "",
      username: "",
      password: "",
      confirmPassword: "",
    },
  });

  const [isError, setIsError] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [isConflict, setIsConflict] = useState<boolean>(false);

  const handleSignup = async (data: z.infer<typeof SignupFormDataSchema>) => {
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

      form.reset();

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.log(err.response);

      if (err.response.status === 409) setIsConflict(true);
      else if (err.response.status !== 400) setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) return <Navigate to={"/login"} />;

  return (
    <div className="w-full max-w-screen-sm mx-auto">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSignup)} className="space-y-8">
          <FormField
            control={form.control}
            name="fullname"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Fullname</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Xeza" {...field} />
                </FormControl>
                <FormDescription></FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

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

          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Confirm super secret password..."
                    {...field}
                  />
                </FormControl>
                <FormDescription></FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {isConflict && (
            <p className="text-danger">That username is already existed.</p>
          )}

          <div className="flex gap-2 items-center justify-between">
            <Link to={"/login"}>
              <Button
                type="button"
                className=""
                variant={"default"}
                size={"sm"}
              >
                Login
              </Button>
            </Link>

            <div className="flex gap-2 items-center justify-between">
              <Button
                onClick={() => form.reset()}
                variant={"destructive"}
                type="button"
                size={"sm"}
              >
                Clear
              </Button>

              <Button
                disabled={isLoading || isError}
                variant={"default"}
                type="submit"
                size={"sm"}
              >
                <LoadingWrapper isLoading={isLoading} isError={isError}>
                  Create
                </LoadingWrapper>
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default Signup;
