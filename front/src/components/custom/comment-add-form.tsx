import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import axios from "axios";
import { z } from "zod";

import { ContentFormData } from "@/shared/forms";
import { ApiOrigin } from "@/shared/constants";
import { PostType } from "@/shared/types";
import useAuthStore from "@/stores/auth";

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

type CommentAddFormPropsType = {
  creatorid: string;
  post: PostType;

  isLoading: boolean;
  setIsLoading: (newState: boolean) => void;

  isError: boolean;
  setIsError: (newState: boolean) => void;

  setAllPostsState: (newAllPostsState: PostType[]) => void;
  allPostsState: PostType[];
};

const CommentAddForm = ({
  creatorid,
  post,

  setIsError,
  isError,

  setIsLoading,
  isLoading,

  setAllPostsState,
  allPostsState,
}: CommentAddFormPropsType) => {
  const authData = useAuthStore((state) => state.authData);

  const form = useForm<z.infer<typeof ContentFormData>>({
    resolver: zodResolver(ContentFormData),
    defaultValues: {
      content: "",
    },
  });

  const handleAddComment = async (data: z.infer<typeof ContentFormData>) => {
    const url = ApiOrigin + `/users/${creatorid}/posts/${post.id}/comments`;

    try {
      setIsLoading(true);

      const res = await axios({
        url,
        method: "post",
        headers: {
          Authorization: `Bearer ${authData.token}`,
        },
        data: { ...data }, // only content field
      });

      // console.log(res.data);

      const responsePost = res.data;
      // merge responsed one with the old one
      const newPost = Object.assign({}, post, responsePost);
      // update old state with new one
      const newPostsFeed = allPostsState.map((p) =>
        p.id === post.id ? newPost : p,
      );
      setAllPostsState(newPostsFeed);

      form.reset();
    } catch (err) {
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleAddComment)}
          className="space-y-8"
        >
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel></FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Create a new comment..."
                    {...field}
                  ></Textarea>
                </FormControl>
                <FormDescription></FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex gap-2 items-center justify-end">
            <Button
              variant={"destructive"}
              type="button"
              onClick={() => form.reset()}
            >
              Clear
            </Button>

            <div className="self-stretch">
              <Separator className="" orientation="vertical"></Separator>
            </div>

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
    </div>
  );
};

export default CommentAddForm;
