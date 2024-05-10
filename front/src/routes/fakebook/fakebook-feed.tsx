import ConnectionsFeed from "@/components/custom/connections-feed";
import PostsFeed from "@/components/custom/posts-feed";

const FakebookFeed = () => {
  return (
    <div className="flex-1 flex gap-2 max-w-screen-lg mx-auto w-full">
      <PostsFeed className="flex-1">
        <h2 className="">Feed</h2>
      </PostsFeed>

      <ConnectionsFeed className="w-1/3 overflow-auto">
        <h2 className="">Connections</h2>
      </ConnectionsFeed>
    </div>
  );
};

export default FakebookFeed;
