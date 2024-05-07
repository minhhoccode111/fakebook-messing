import { CommentType } from "@/shared/types";
import MyAvatar from "@/components/custom/my-avatar";

const Comment = ({ comment }: { comment: CommentType }) => {
  const { likes, creator, content } = comment;

  // console.log(comment);

  return (
    <li>
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

      <div className="">
        <button className="font-bold">{likes} up</button>
      </div>
    </li>
  );
};

export default Comment;
