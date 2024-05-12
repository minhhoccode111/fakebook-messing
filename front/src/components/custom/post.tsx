import { MdOutlineExpandLess, MdOutlineExpandMore } from "react-icons/md";
import { useState, useEffect } from "react";
import axios from "axios";

import { ApiOrigin } from "@/shared/constants";
import { PostType } from "@/shared/types";
import useAuthStore from "@/stores/auth";

import CommentAddForm from "@/components/custom/comment-add-form";
import LoadingWrapper from "@/components/custom/loading-wrapper";
import DangerHtml from "@/components/custom/danger-html";
import Connection from "@/components/custom/connection";
import Comment from "@/components/custom/comment";

import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

type PostPropsType = {
  post: PostType;
  className: string;
  isSelf: boolean;
  allPostsState: PostType[];
  setAllPostsState: (newAllPostsState: PostType[]) => void;
};

const Post = ({
  post,
  className,

  // to show delete button
  isSelf,

  // to keep track and update all posts state when a post is fetched full
  allPostsState,
  setAllPostsState,
}: PostPropsType) => {
  // global states
  const authData = useAuthStore((state) => state.authData);

  // destruct variables
  const { creator, likes, commentsLength, createdAtFormatted } = post;
  // this will be changed when toggle less or more
  let { content, comments } = post;

  // display everything in a post and display preview only
  const [isShowLess, setIsShowLess] = useState(true);

  // when the ...more button or comments button is clicked
  const [willFetchFull, setWillFetchFull] = useState(false);

  // to know we once fetch full post once
  const [isFetchedFull, setIsFetchedFull] = useState(false);

  // simple tracking states
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  // hide some contents if post is not expand
  if (isShowLess) {
    if (content.length > 200) {
      content = content.slice(0, 200) + "...";
    }

    comments = comments.slice(0, 2);
  }

  // fetch full post and only do it once
  useEffect(() => {
    const tmp = async () => {
      try {
        setIsLoading(true);

        const res = await axios({
          method: "get",
          url: ApiOrigin + `/users/${creator.id}/posts/${post.id}`,
          headers: {
            Authorization: `Bearer ${authData.token}`,
          },
        });

        // console.log(res.data);

        const responsePost = res.data;
        // merge the responsed one with old one
        const newPost = Object.assign({}, post, responsePost);
        // update new state with new one
        const newPostsFeed = allPostsState.map((p) =>
          p.id === post.id ? newPost : p,
        );
        setAllPostsState(newPostsFeed);

        // since the response post contain everything
        setIsFetchedFull(true);

        // expand the post to let user know every data is fetched
        setIsShowLess(false);
      } catch (err) {
        console.error(err);

        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };

    // only fetch full post data once
    if (willFetchFull && !isFetchedFull) tmp();
  }, [willFetchFull, isFetchedFull, creator.id, post.id, authData.token, post]);

  const handleLikePost = async () => {
    try {
      setIsLoading(true);

      const res = await axios({
        method: "post",
        url: ApiOrigin + `/users/${creator.id}/posts/${post.id}/likes`,
        headers: {
          Authorization: `Bearer ${authData.token}`,
        },
      });

      // console.log(res.data);

      const responsePost = res.data;
      // merge responsed one with old one
      const newPost = Object.assign({}, post, responsePost);
      // update state with new one
      const newPostsFeed = allPostsState.map((p) =>
        p.id === post.id ? newPost : p,
      );
      setAllPostsState(newPostsFeed);

      setIsFetchedFull(true);

      setIsShowLess(false);
    } catch (err) {
      console.log(err);

      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeletePost = async () => {
    try {
      setIsLoading(true);

      await axios({
        method: "delete",
        url: ApiOrigin + `/users/${creator.id}/posts/${post.id}`,
        headers: {
          Authorization: `Bearer ${authData.token}`,
        },
      });

      // console.log(res.data);

      setAllPostsState(allPostsState.filter((p) => p.id !== post.id));
    } catch (err) {
      console.log(err);

      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  // console.log(post);

  return (
    <li className={"" + " " + className}>
      <Connection
        className={""}
        isAllowActions={false}
        user={creator}
      ></Connection>

      <div className="pl-12">
        <div className="flex flex-col gap-4 py-4">
          <DangerHtml content={content}></DangerHtml>

          <p className="self-end italic text-xs">{createdAtFormatted}</p>

          <Button
            onClick={() => {
              setIsShowLess((state) => !state);
              setWillFetchFull(true);
            }}
            className="self-end font-bold text-xl"
            variant={"default"}
            size={"icon"}
          >
            {isShowLess ? (
              <MdOutlineExpandMore className="" />
            ) : (
              <MdOutlineExpandLess className="" />
            )}
          </Button>
        </div>

        <div className="flex gap-2 items-center justify-end font-bold">
          <Button
            size={"sm"}
            className=""
            variant={"outline"}
            onClick={handleLikePost}
            disabled={isError || isLoading}
          >
            <LoadingWrapper isLoading={isLoading} isError={isError}>
              {likes} likes
            </LoadingWrapper>
          </Button>

          <div className="self-stretch">
            <Separator className="" orientation="vertical"></Separator>
          </div>

          <Button
            size={"sm"}
            className=""
            variant={"outline"}
            disabled={isError || isLoading}
            onClick={() => {
              setWillFetchFull(true);
              setIsShowLess((state) => !state);
            }}
          >
            <LoadingWrapper isLoading={isLoading} isError={isError}>
              Comments
            </LoadingWrapper>
          </Button>

          {isSelf && (
            <>
              <div className="self-stretch">
                <Separator className="" orientation="vertical"></Separator>
              </div>

              <Button
                size={"sm"}
                className=""
                variant={"destructive"}
                onClick={handleDeletePost}
              >
                <LoadingWrapper isLoading={isLoading} isError={isError}>
                  Delete
                </LoadingWrapper>
              </Button>
            </>
          )}
        </div>

        <h3 className="font-bold text-lg mt-4">{commentsLength} Comments</h3>

        {!!comments.length && <Separator className="my-2" />}

        <ul className="">
          {comments.map((comment, index: number) => (
            <li key={index} className="">
              <Comment
                creatorid={creator.id}
                comment={comment}
                post={post}
                // to display fetching state after user like a comment
                isLoading={isLoading}
                setIsLoading={setIsLoading}
                isError={isError}
                setIsError={setIsError}
                // also expand and fetch full the post data after user like a comment
                // because they can like the 2 preview comments when the post no expand yet
                setIsShowLess={setIsShowLess}
                setIsFetchedFull={setIsFetchedFull}
                // to update all posts state after new data is returned
                allPostsState={allPostsState}
                setAllPostsState={setAllPostsState}
              />

              {index !== comments.length - 1 && <Separator className="my-4" />}
            </li>
          ))}
        </ul>

        {!isShowLess && (
          <>
            <Separator className="my-4"></Separator>
            <CommentAddForm
              // send comment to the rigth post of a user
              post={post}
              creatorid={creator.id}
              // to display fetching state when create a new comment
              isLoading={isLoading}
              setIsLoading={setIsLoading}
              isError={isError}
              setIsError={setIsError}
              allPostsState={allPostsState}
              setAllPostsState={setAllPostsState}
            />
          </>
        )}
      </div>

      <Separator className="my-8" />
    </li>
  );
};

export default Post;
