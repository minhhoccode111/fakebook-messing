import { useState, useEffect } from "react";
import axios from "axios";

import { ApiOrigin } from "@/shared/constants";
import { PostType } from "@/shared/types";
import useAuthStore from "@/stores/auth";

// NOTE: consider using index file to fast import everything in /custom dir
import MyAvatar from "@/components/custom/my-avatar";
import Comment from "@/components/custom/comment";
import LoadingWrapper from "@/components/custom/loading-wrapper";
import CommentAddForm from "@/components/custom/comment-add-form";

type PostPropsType = {
  post: PostType;
  isSelf: boolean;
  allPostsState: PostType[];
  setAllPostsState: (newAllPostsState: PostType[]) => void;
};

const Post = ({
  post,

  // to show delete button
  isSelf,

  // to keep track and update all posts state when a post is fetched full
  allPostsState,
  setAllPostsState,
}: PostPropsType) => {
  // global states
  const authData = useAuthStore((state) => state.authData);

  // destruct variables
  const { creator, likes, commentsLength } = post;
  // this will be changed
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
        const newPost = Object.assign({}, post, responsePost); // merge
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
      const newPost = Object.assign({}, post, responsePost); // merge
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
        <p className="break-all">{content}</p>
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
        <LoadingWrapper isLoading={isLoading} isError={isError}>
          {/* click button to like post */}
          <button onClick={handleLikePost} className="text-2xl">
            ^ {likes}
          </button>
        </LoadingWrapper>

        <LoadingWrapper isLoading={isLoading} isError={isError}>
          {/* click button to expand everything and fetch full post */}
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

        {isSelf && (
          <LoadingWrapper isLoading={isLoading} isError={isError}>
            {/* click button to like post */}
            <button onClick={handleDeletePost} className="text-2xl">
              delete
            </button>
          </LoadingWrapper>
        )}
      </div>

      <ul className="">
        {comments.map((comment, index: number) => (
          <Comment
            key={index}
            // comment to display itself
            comment={comment}
            // to like the right comment of a post of a usesr
            creatorid={creator.id}
            post={post}
            // to display fetching state after user like a comment
            isLoading={isLoading}
            isError={isError}
            setIsLoading={setIsLoading}
            setIsError={setIsError}
            // also expand and fetch full the post data after user like a comment
            // because they can like the 2 preview comments when the post no expand yet
            setIsShowLess={setIsShowLess}
            setIsFetchedFull={setIsFetchedFull}
            // to update all posts state after new data is returned
            allPostsState={allPostsState}
            setAllPostsState={setAllPostsState}
          />
        ))}
      </ul>

      {!isShowLess && (
        <CommentAddForm
          // send comment to the rigth post of a user
          creatorid={creator.id}
          post={post}
          // to display fetching state when create a new comment
          isLoading={isLoading}
          isError={isError}
          setIsLoading={setIsLoading}
          setIsError={setIsError}
          allPostsState={allPostsState}
          setAllPostsState={setAllPostsState}
        />
      )}
    </li>
  );
};

export default Post;
