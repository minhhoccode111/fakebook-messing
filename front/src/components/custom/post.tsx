import { useState, useEffect } from "react";
import axios from "axios";

import { ApiOrigin } from "@/shared/constants";
import { PostType } from "@/shared/types";
import { useAuthStore } from "@/main";

import MyAvatar from "@/components/custom/my-avatar";
import Comment from "@/components/custom/comment";
import LoadingWrapper from "@/components/custom/loading-wrapper";
import CommentAddForm from "@/components/custom/comment-add-form";

const Post = ({ post }: { post: PostType }) => {
  const authData = useAuthStore((state) => state.authData);

  // local post state after fetch full
  const [localPost, setLocalPost] = useState(post);

  // destruct variables
  const { creator, likes, commentsLength } = localPost;
  let { content, comments } = localPost;

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

  // only fetch full a post once when willFetchFull === true and isFetchedFull === false
  useEffect(() => {
    const tmp = async () => {
      try {
        setIsLoading(true);

        const res = await axios({
          method: "get",
          url: ApiOrigin + `/users/${creator.id}/posts/${localPost.id}`,
          headers: {
            Authorization: `Bearer ${authData.token}`,
          },
        });

        const responsePost = res.data;

        // console.log(responsePost);

        setLocalPost({ ...post, ...responsePost });

        setIsFetchedFull(true);

        setIsShowLess(false);
      } catch (err) {
        console.error(err);

        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };

    if (willFetchFull && !isFetchedFull) tmp();
  }, [
    willFetchFull,
    isFetchedFull,
    creator.id,
    localPost.id,
    authData.token,
    post,
  ]);

  const handleLikePost = async () => {
    try {
      setIsLoading(true);

      const res = await axios({
        method: "post",
        url: ApiOrigin + `/users/${creator.id}/posts/${localPost.id}/likes`,
        headers: {
          Authorization: `Bearer ${authData.token}`,
        },
      });

      const responsePost = res.data;

      // console.log(responsePost);

      setLocalPost({ ...post, ...responsePost });

      setIsFetchedFull(true);

      setIsShowLess(false);
    } catch (err) {
      console.log(err);

      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  // console.log(post);

  return (
    // TODO: add markdown parser
    <li className="">
      <div className="">
        <p className="">{creator.fullname}</p>

        <MyAvatar
          src={creator.avatarLink}
          fallback={creator.fullname.charAt(0)}
        />
      </div>

      <div className="">
        <p className="">{content}</p>
        <button
          onClick={() => {
            setIsShowLess((state) => !state);
            setWillFetchFull(true);
          }}
          className=""
        >
          {isShowLess ? (
            <span className="">more</span>
          ) : (
            <span className="">show less</span>
          )}
        </button>
      </div>

      <div className="flex gap-2 items-center justify-evenly font-bold">
        <p className="flex items-center justify-between gap-2">
          <LoadingWrapper isLoading={isLoading} isError={isError}>
            <button onClick={handleLikePost} className="text-2xl">
              ^
            </button>
          </LoadingWrapper>
          <span className="">{likes}</span>
        </p>

        <LoadingWrapper isLoading={isLoading} isError={isError}>
          <button
            onClick={() => {
              setWillFetchFull(true);
              setIsShowLess((state) => !state);
            }}
            className=""
          >
            {commentsLength} comments
          </button>
        </LoadingWrapper>
      </div>

      <ul className="">
        {comments.map((comment, index: number) => (
          <Comment
            key={index}
            comment={comment}
            creatorid={creator.id}
            postid={localPost.id}
            // to update after user like a comment
            setLocalPost={setLocalPost}
            localPost={localPost}
            isLoading={isLoading}
            isError={isError}
            setIsLoading={setIsLoading}
            setIsError={setIsError}
            setIsShowLess={setIsShowLess}
            setIsFetchedFull={setIsFetchedFull}
          />
        ))}
      </ul>

      {!isShowLess && (
        <CommentAddForm
          creatorid={creator.id}
          postid={localPost.id}
          setLocalPost={setLocalPost}
          localPost={localPost}
          isLoading={isLoading}
          isError={isError}
          setIsLoading={setIsLoading}
          setIsError={setIsError}
        />
      )}
    </li>
  );
};

export default Post;
