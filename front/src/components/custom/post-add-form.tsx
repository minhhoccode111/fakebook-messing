import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import axios from "axios";
import { z } from "zod";

import useAuthStore from "@/stores/auth";
import { PostType } from "@/shared/types";
import { ApiOrigin } from "@/shared/constants";
import { ContentFormData } from "@/shared/forms";

import LoadingWrapper from "@/components/custom/loading-wrapper";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

type PostAddFormPropsType = {
  userPosts: PostType[];
  setUserPosts: (newUserPosts: PostType[]) => void;
};

const PostAddForm = ({ userPosts, setUserPosts }: PostAddFormPropsType) => {
  const form = useForm<z.infer<typeof ContentFormData>>({
    resolver: zodResolver(ContentFormData),
    defaultValues: {
      content: "",
    },
  });

  const authData = useAuthStore((state) => state.authData);

  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleAddPost = async (data: z.infer<typeof ContentFormData>) => {
    try {
      setIsLoading(true);

      const res = await axios({
        url: ApiOrigin + `/users/${authData.self?.id}/posts`,
        method: "post",
        headers: {
          Authorization: `Bearer ${authData.token}`,
        },
        data: {
          ...data,
        },
      });

      // console.log(res.data);

      setUserPosts([{ ...res.data, comments: [], likes: 0 }, ...userPosts]);

      // setIsSuccess(true);
      form.reset();
    } catch (err: any) {
      console.log(err);

      if (err.response.status !== 400) setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleAddPost)} className="space-y-8">
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  <h3 className="font-bold text-xl">Create a new post</h3>
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="What's in your mind?"
                    {...field}
                  ></Textarea>
                </FormControl>
                <FormDescription></FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex gap-2 items-center justify-between">
            <Button
              variant={"destructive"}
              type="button"
              onClick={() => form.reset()}
            >
              Clear
            </Button>

            <Button
              variant={"default"}
              type="submit"
              disabled={isLoading || isError}
            >
              <LoadingWrapper isLoading={isLoading} isError={isError}>
                Create
              </LoadingWrapper>
            </Button>
          </div>
        </form>
      </Form>

      <Separator className="my-4" />
    </div>
  );
};

export default PostAddForm;
