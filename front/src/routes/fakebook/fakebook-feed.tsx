import ConnectionsFeed from "@/components/custom/connections-feed";
import PostsFeed from "@/components/custom/posts-feed";

const FakebookFeed = () => {
  return (
    <div className="flex-1 flex gap-2">
      <PostsFeed className="flex-1">
        <h2 className="">All posts in feed</h2>
      </PostsFeed>

      <ConnectionsFeed className="">
        <h2 className="">All connections in feed</h2>
      </ConnectionsFeed>
    </div>
  );
};

export default FakebookFeed;
