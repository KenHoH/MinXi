import { useEffect, useRef, useCallback, useState } from "react";
import { useLoading } from "@/shared/context/LoadingContext";
import { Masonry } from "@/shared/components/Masonry";
import type { FullContentDto } from "@/service/api";
import { renderItem } from "../logic/useRenderContent";
import useGetHistory from "../logic/useGetHistory";
import { useAuthContext } from "@/feature/auth/context/AuthContext";
import type { FullContentWithHistoryProps } from "@/feature/content/components/models/FullContentWithHistory";

interface FeedListProps {
  onLoadMore: () => Promise<FullContentDto[]>;
  currentFilter?: string;
  enableInfiniteScroll?: boolean;
}

export default function FeedList({
  onLoadMore,
  currentFilter,
  enableInfiniteScroll = true,
}: FeedListProps) {
  const { showLoading, hideLoading } = useLoading();
  const { user, isLoading: authLoading } = useAuthContext();
  const [items, setItems] = useState<FullContentDto[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const observerTarget = useRef<HTMLDivElement>(null);
  const [histories, historiesLoading] = useGetHistory();
  const [contents, setContents] = useState<FullContentWithHistoryProps[]>([]);

  useEffect(() => {
    const mergedItems = items.map((item) => {
      const userHistory = histories.find(
        (h) => h.content_id === item.content_id
      );
      return {
        ...item,
        liked: userHistory?.liked || false,
        pinned: userHistory?.pinned || false,
      };
    });

    setContents(mergedItems);
  }, [histories, items]);

  const loadMore = useCallback(async () => {
    if (isLoading || !hasMore || !onLoadMore) return;

    setIsLoading(true);
    showLoading();

    try {
      const newItems = await onLoadMore();

      if (newItems.length === 0) {
        setHasMore(false);
      } else {
        setItems((prev) => [...prev, ...newItems]);
      }
    } catch (error) {
      console.error("Failed to load more items:", error);
      setHasMore(false);
    } finally {
      setIsLoading(false);
      hideLoading();
    }
  }, [isLoading, hasMore, onLoadMore, showLoading, hideLoading]);

  useEffect(() => {
    console.log("Filter changed to:", currentFilter);

    if (authLoading) return;

    setItems([]);
    setHasMore(true);
    setIsLoading(false);

    onLoadMore().then((newItems) => {
      setItems(newItems);
      if (newItems.length === 0) setHasMore(false);
    });
  }, [currentFilter, user, authLoading]);

  useEffect(() => {
    if (!enableInfiniteScroll) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (
          entries[0].isIntersecting &&
          hasMore &&
          !isLoading &&
          items.length !== 0
        ) {
          loadMore();
        }
      },
      { threshold: 0.2, rootMargin: "100px" }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => observer.disconnect();
  }, [enableInfiniteScroll, loadMore, hasMore, isLoading]);

  return (
    <div className="w-3/4 h-full">
      {contents.length === 0 ? (
        authLoading || historiesLoading ? null : (
          <div className="text-center py-12 text-gray-500">
            No items to display
          </div>
        )
      ) : (
        <div className="p-4">
          <Masonry columns={4}>
            {contents.map((item) => (
              <div key={item.content_id}>
                {renderItem(item, item.liked || false, item.pinned || false)}
              </div>
            ))}
          </Masonry>
        </div>
      )}

      {enableInfiniteScroll && hasMore && (
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

      {!hasMore && items.length > 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>No more items to load</p>
        </div>
      )}
    </div>
  );
}
