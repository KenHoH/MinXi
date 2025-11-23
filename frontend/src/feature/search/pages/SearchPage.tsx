"use client";

import { useCallback, useState, useRef, useEffect } from "react";
import { Search } from "lucide-react";
import RootLayout from "@/app/LayoutPage";
import { ContentComponent } from "@/feature/content/components/ContentComponent/ContentComponent";
import { PostComponent } from "@/feature/content/components/PostComponent/PostComponent";
import { useLoading } from "@/shared/context/LoadingContext";

interface Content {
  content_id: number;
  creator_id: number;
  title: string;
  post_type: "image" | "video";
  likes: number;
  comments: number;
  views: number;
}

interface Post {
  content_id: number;
  creator_id: number;
  title: string;
  description: string;
  likes: number;
  comments: number;
  post_type: "post";
}

type FeedItem = Content | Post;

const generateSearchResults = (page: number, query: string): FeedItem[] => {
  const items: FeedItem[] = [];
  const startId = (page - 1) * 12;

  // Return empty if no search query
  if (!query.trim()) return items;

  for (let i = 0; i < 12; i++) {
    const id = startId + i;
    const isPost = id % 3 === 0;

    if (isPost) {
      items.push({
        content_id: id,
        creator_id: Math.floor(Math.random() * 100),
        title: `Post ${id}: ${query}`,
        description: `Search result for "${query}" - This is a detailed description for post ${id}.`,
        likes: Math.floor(Math.random() * 5000),
        comments: Math.floor(Math.random() * 500),
        post_type: "post" as const,
      });
    } else {
      items.push({
        content_id: id,
        creator_id: Math.floor(Math.random() * 100),
        title: `Media ${id} - ${query}`,
        post_type: id % 2 === 0 ? ("image" as const) : ("video" as const),
        likes: Math.floor(Math.random() * 10000),
        comments: Math.floor(Math.random() * 1000),
        views: Math.floor(Math.random() * 100000),
      });
    }
  }

  return items;
};

export default function SearchPage() {
  const { showLoading, hideLoading } = useLoading();
  const [searchQuery, setSearchQuery] = useState("");
  const [items, setItems] = useState<FeedItem[]>([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const observerTarget = useRef<HTMLDivElement>(null);

  const loadMore = useCallback(async () => {
    if (isLoading || !hasMore || !searchQuery.trim()) return;

    setIsLoading(true);
    showLoading();

    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      const newItems = generateSearchResults(page, searchQuery);

      if (newItems.length === 0) {
        setHasMore(false);
      } else {
        setItems((prev) => [...prev, ...newItems]);
        setPage((prev) => prev + 1);
      }
    } catch (error) {
      console.error("Failed to load search results:", error);
      setHasMore(false);
    } finally {
      setIsLoading(false);
      hideLoading();
    }
  }, [page, isLoading, hasMore, searchQuery, showLoading, hideLoading]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setItems([]);
    setPage(1);
    setHasMore(true);
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          loadMore();
        }
      },
      { threshold: 0.2, rootMargin: "100px" }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => observer.disconnect();
  }, [loadMore, hasMore, isLoading]);

  const renderItem = (item: FeedItem) => {
    const isPost = item.post_type === "post";
    const isContent = item.post_type === "image" || item.post_type === "video";

    if (isContent) {
      return (
        <ContentComponent key={item.content_id} content={item as Content} />
      );
    } else if (isPost) {
      return <PostComponent key={item.content_id} post={item as Post} />;
    }

    return null;
  };

  return (
    <RootLayout>
      <div className="w-full h-full bg-dark-900 flex flex-col justify-start items-center">
        {/* Search Bar */}
        <div className="w-3/4 pt-4 mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search posts, content, and people..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full bg-dark-800 border border-dark-700 rounded-lg pl-10 pr-4 py-2 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-burgundy-600"
            />
          </div>
        </div>

        {/* Results */}
        <div className="w-3/4 h-full">
          {searchQuery.trim() ? (
            <>
              {/* Masonry Grid */}
              <div
                className="p-4"
                style={{
                  columnCount: "auto",
                  columnWidth: "280px",
                  columnGap: "1rem",
                }}
              >
                {items.length === 0 && !isLoading ? (
                  <div className="text-center py-12 text-gray-500">
                    Scroll to load search results for "{searchQuery}"
                  </div>
                ) : (
                  items.map((item) => (
                    <div
                      key={`${item.post_type}-${item.content_id}`}
                      className="mb-4"
                      style={{ breakInside: "avoid", pageBreakInside: "avoid" }}
                    >
                      {renderItem(item)}
                    </div>
                  ))
                )}
              </div>

              {/* Infinite scroll trigger */}
              {hasMore && (
                <div ref={observerTarget} className="py-8 text-center">
                  {isLoading ? (
                    <div className="flex justify-center items-center">
                      <div className="w-8 h-8 border-4 border-burgundy-600 border-t-burgundy-400 rounded-full animate-spin" />
                    </div>
                  ) : (
                    <p className="text-gray-400">Scroll for more...</p>
                  )}
                </div>
              )}

              {/* End of results message */}
              {!hasMore && items.length > 0 && (
                <div className="text-center py-8 text-gray-500">
                  <p>No more results to load</p>
                </div>
              )}
            </>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              <p>Enter a search query to find posts and content</p>
            </div>
          )}
        </div>
      </div>
    </RootLayout>
  );
}
