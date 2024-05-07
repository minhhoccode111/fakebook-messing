import ConnectionsFeed from "@/components/custom/connections-feed";
import NewPost from "@/components/custom/new-post-feed";
import PostsFeed from "@/components/custom/posts-feed";

const FakebookFeed = () => {
  return (
    <div className="">
      <NewPost></NewPost>
      <ConnectionsFeed></ConnectionsFeed>
      <PostsFeed></PostsFeed>
    </div>
  );
};

export default FakebookFeed;
