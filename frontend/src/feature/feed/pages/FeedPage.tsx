import { useCallback, useState } from "react";
import FeedList from "@/feature/feed/components/FeedList";
import { TopFeedBar } from "@/feature/feed/components/TopFeedBar";
import RootLayout from "@/app/LayoutPage";

const generateMockItems = (page: number, filter: string) => {
  const items = [];
  const startId = (page - 1) * 12;

  for (let i = 0; i < 12; i++) {
    const id = startId + i;
    let isPost = id % 3 === 0;

    // Filter logic based on selected filter
    let creatorId = Math.floor(Math.random() * 100);

    if (filter === "Followed") {
      // Simulate followed creators (IDs 1-20)
      creatorId = Math.floor(Math.random() * 20) + 1;
      isPost = Math.random() > 0.5; // Mix of posts and content
    } else if (filter === "Friends") {
      // Simulate friend creators (IDs 21-50)
      creatorId = Math.floor(Math.random() * 30) + 21;
      isPost = Math.random() > 0.7; // Mostly content from friends
    } else if (filter.startsWith("Board:")) {
      // Own board content (high creator IDs for user boards)
      creatorId = 999; // User's own ID
      isPost = Math.random() > 0.3; // Mix with preference for posts
    }
    // "All" uses default random mix

    if (isPost) {
      items.push({
        content_id: id,
        creator_id: creatorId,
        title: `Post ${id}: Amazing content from ${filter}`,
        description: `This is a detailed description for post ${id}. It can have multiple lines of text.`,
        likes: Math.floor(Math.random() * 5000),
        comments: Math.floor(Math.random() * 500),
        post_type: "post" as const,
        parent_id: id === 3 ? 1 : id === 6 ? 3 : id === 9 ? 7 : undefined,
      });
    } else {
      items.push({
        content_id: id,
        creator_id: creatorId,
        title: `Media ${id} - ${filter}`,
        post_type: id % 2 === 0 ? ("image" as const) : ("video" as const),
        likes: Math.floor(Math.random() * 10000),
        comments: Math.floor(Math.random() * 1000),
        views: Math.floor(Math.random() * 100000),
      });
    }
  }

  return items;
};

export default function FeedPage() {
  const [currentFilter, setCurrentFilter] = useState("All");
  const userBoards = ["Design", "Photography", "Travel"];

  const handleLoadMore = useCallback(
    async (page: number) => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      return generateMockItems(page, currentFilter);
    },
    [currentFilter]
  );

  const handleFilterChange = (filter: string) => {
    setCurrentFilter(filter);
  };

  return (
    <RootLayout>
      <div className="w-full h-full bg-dark-900 flex flex-col justify-start items-center">
        <div className="w-3/4 pt-4">
          <TopFeedBar
            userBoards={userBoards}
            onFilterChange={handleFilterChange}
          />
        </div>
        <FeedList onLoadMore={handleLoadMore} />
      </div>
    </RootLayout>
  );
}
