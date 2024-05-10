import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { Navigate, redirect } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useState } from "react";
import axios from "axios";

import useAuthStore from "@/stores/auth";

import LoadingWrapper from "@/components/custom/loading-wrapper";

import { SignupFormDataSchema } from "@/shared/forms";

import { ApiOrigin } from "@/shared/constants";

const Login = () => {
  const form = useForm<z.infer<typeof SignupFormDataSchema>>();

  const [isError, setIsError] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  const setAuthData = useAuthStore((state) => state.setAuthData);

  const handleLogin =
    (type = "normal") =>
    async (data: z.infer<typeof SignupFormDataSchema>) => {
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
        redirect("/fakebook");
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        console.log(err);

        // TODO: try to add err types AxiosError
        if (err.response.status !== 400 && err.response.status !== 401)
          setIsError(true);
      } finally {
        setIsLoading(false);

        // reset form inputs to prevent spam
        form.reset();
      }
    };

  return <></>;
};

export default Login;
