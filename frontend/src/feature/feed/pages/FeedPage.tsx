import { useState } from "react";
import FeedList from "@/feature/feed/components/FeedList";
import { TopFeedBar } from "@/feature/feed/components/TopFeedBar";
import RootLayout from "@/app/LayoutPage";
import { useFeedContent } from "../logic/useFeedContent";
import { useUserBoards } from "../logic/useGetBoardContent";

export default function FeedPage() {
  const [currentFilter, setCurrentFilter] = useState("All");

  const { userBoards, boardContentsMap } = useUserBoards();
const { loadMore } = useFeedContent(
    currentFilter,
    userBoards,
    boardContentsMap
  );

  const filters = [
    "All",
    "Following",
    "Friends",
    ...userBoards.map((b) => b.title),
  ];
  const isBoardFilter = userBoards.some((b) => b.title === currentFilter);

  return (
    <RootLayout>
      <div className="w-full h-full bg-dark-900 flex flex-col justify-start items-center">
        <div className="w-3/4 pt-4">
          <TopFeedBar filters={filters} onFilterChange={setCurrentFilter} />
        </div>
        <FeedList
          onLoadMore={loadMore}
          currentFilter={currentFilter}
          enableInfiniteScroll={!isBoardFilter}
        />
      </div>
    </RootLayout>
  );
}
