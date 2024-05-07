import { PostType } from "@/shared/types";
import MyAvatar from "@/components/custom/my-avatar";
import Comment from "@/components/custom/comment";

const Post = ({ post }: { post: PostType }) => {
  const { creator, comments, likes, commentsLength, content } = post;

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
      </div>

      <div className="flex gap-2 items-center justify-evenly font-bold">
        <button className="">{likes} up</button>
        <button className="">{commentsLength} comments</button>
      </div>

      <ul className="">
        {comments.map((comment, index: number) => (
          <Comment key={index} comment={comment} />
        ))}
      </ul>
    </li>
  );
};

export default Post;
