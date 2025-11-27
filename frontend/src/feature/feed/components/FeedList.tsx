"use client";

import { useEffect, useRef, useCallback, useState } from "react";
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

interface FeedListProps {
  onLoadMore: (page: number) => Promise<FeedItem[]>;
}

export default function FeedList({ onLoadMore }: FeedListProps) {
  const { showLoading, hideLoading } = useLoading();

  const [items, setItems] = useState<FeedItem[]>([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const observerTarget = useRef<HTMLDivElement>(null);

  const loadMore = useCallback(async () => {
    if (isLoading || !hasMore || !onLoadMore) return;

    setIsLoading(true);
    showLoading();

    try {
      const newItems = await onLoadMore(page);

      if (newItems.length === 0) {
        setHasMore(false);
      } else {
        setItems((prev) => [...prev, ...newItems]);
        setPage((prev) => prev + 1);
      }
    } catch (error) {
      console.error("Failed to load more items:", error);
      setHasMore(false);
    } finally {
      setIsLoading(false);
      hideLoading();
    }
  }, [page, isLoading, hasMore, onLoadMore, showLoading, hideLoading]);

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
    <div className="w-3/4 h-full">
      {/* Masonry Grid */}
      <div
        className="p-4"
        style={{ columnCount: "auto", columnWidth: "280px", columnGap: "1rem" }}
      >
        {items.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            No items to display
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

      {/* End of feed message */}
      {!hasMore && items.length > 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>No more items to load</p>
        </div>
      )}
    </div>
  );
}
