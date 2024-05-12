import ConnectionsFeed from "@/components/custom/connections-feed";
import PostsFeed from "@/components/custom/posts-feed";

const FakebookFeed = () => {
  return (
    <div className="flex-1 flex gap-10 max-w-screen-lg mx-auto w-full text-gray-900 dark:text-gray-100">
      <PostsFeed className="flex-1 w-2/3"></PostsFeed>

      <ConnectionsFeed className="w-1/3 overflow-auto"></ConnectionsFeed>
    </div>
  );
};

export default FakebookFeed;
