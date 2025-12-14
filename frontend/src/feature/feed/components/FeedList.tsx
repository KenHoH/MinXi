import { useEffect, useRef, useCallback, useState, useMemo } from "react";
import { useLoading } from "@/shared/context/LoadingContext";
import { Masonry } from "@/shared/components/Masonry";
import type { FullContentDto } from "@/service/api";
import { renderItem } from "../logic/useRenderContent";
import useGetHistory from "../logic/useGetHistory";
import { useAuthContext } from "@/feature/auth/context/AuthContext";
import { FeedListSkeleton } from "./FeedListSkeleton";
import { useParams, useNavigate } from "react-router-dom";
import useHistoryService from "@/shared/hooks/useHistoryService";
import useContentService from "@/shared/hooks/useContentService";
import { ContentDetailComponent } from "@/feature/content/components/ContentComponent/ContentDetail";
import { PostDetailComponent } from "@/feature/content/components/PostComponent/PostDetail";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

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
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const observerTarget = useRef<HTMLDivElement>(null);
  const [histories, historiesLoading] = useGetHistory();
  const navigate = useNavigate();

  const { getByUserAndContent } = useHistoryService();
  const { findOne } = useContentService();
  const { item, type, area } = useParams();

  const [selectedContent, setSelectedContent] = useState<FullContentDto | null>(
    null
  );
  const [contentHistory, setContentHistory] = useState<{
    liked: boolean;
    pinned: boolean;
    likes: number;
    pins: number;
    comments: number;
    reports: number;
  } | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!item || !type || !area || !user) return;

      try {
        const content = await findOne(Number(item), Number(area));
        const userHistory = await getByUserAndContent(
          user.user_id,
          Number(item)
        );
        if (!content) return;

        setSelectedContent(content);
        setContentHistory({
          liked: userHistory?.liked || false,
          pinned: userHistory?.pinned || false,
          likes: content.likes || 0,
          pins: content.pins || 0,
          comments: content.comments || 0,
          reports: content.reports || 0,
        });
      } catch (error) {
        console.error("Failed to fetch content details:", error);
      }
    };

    fetchData();
  }, [item, type, area, user]);

  const handleCloseDetail = () => {
    setSelectedContent(null);
    setContentHistory(null);
    navigate(-1);
  };

  const contents = useMemo(() => {
    return items.map((item) => {
      const userHistory = histories.find(
        (h) => h.content_id === item.content_id
      );
      return {
        ...item,
        liked: userHistory?.liked || false,
        pinned: userHistory?.pinned || false,
      };
    });
  }, [items, histories]);
  const historyMap = useMemo(() => {
    const map = new Map();
    histories.forEach((h) => {
      map.set(h.content_id, {
        liked: h.liked || false,
        pinned: h.pinned || false,
      });
    });
    return map;
  }, [histories]);

  const loadMore = useCallback(async () => {
    if (isLoading || !hasMore || !onLoadMore) return;

    setIsLoading(true);

    try {
      const newItems = await onLoadMore();

      if (newItems.length === 0) {
        setHasMore(false);
      } else {
        await new Promise((resolve) => setTimeout(resolve, 300));

        setItems((prev) => [
          ...prev,
          ...newItems.filter(
            (item) => !prev.some((p) => p.content_id === item.content_id)
          ),
        ]);
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    } catch (error) {
      console.error("Failed to load more items:", error);
      setHasMore(false);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, hasMore, onLoadMore, showLoading, hideLoading]);

  useEffect(() => {
    console.log("Filter changed to:", currentFilter);

    if (authLoading) return;

    setItems([]);
    setHasMore(true);
    setIsLoading(false);
    setIsInitialLoading(true);

    onLoadMore().then((newItems) => {
      setItems(newItems);
      if (newItems.length === 0) setHasMore(false);
      setIsInitialLoading(false);
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
      {isInitialLoading || authLoading || historiesLoading ? (
        <FeedListSkeleton />
      ) : contents.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          No items to display
        </div>
      ) : (
        <div className="p-4">
          <Masonry columns={3}>
            {items.map((item) => {
              const history = historyMap.get(item.content_id) || {
                liked: false,
                pinned: false,
              };
              return (
                <div key={item.content_id} className="feed-item-wrapper">
                  {renderItem(item, history.liked, history.pinned)}
                </div>
              );
            })}

            {isLoading &&
              enableInfiniteScroll &&
              Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={`skeleton-${index}`}
                  className="mb-4 transition-all duration-300 ease-in-out"
                >
                  <div className="bg-dark-800 border border-dark-700 rounded-lg p-4 min-h-[180px]">
                    <Skeleton
                      height={20}
                      width="75%"
                      baseColor="#1f2937"
                      highlightColor="#374151"
                      className="mb-2"
                    />
                    <Skeleton
                      count={2}
                      height={12}
                      baseColor="#1f2937"
                      highlightColor="#374151"
                      className="mb-4"
                    />
                    <div className="flex gap-4 items-center">
                      <Skeleton
                        circle
                        height={24}
                        width={24}
                        baseColor="#1f2937"
                        highlightColor="#374151"
                      />
                      <div className="flex gap-2 flex-1">
                        <Skeleton
                          height={12}
                          width={40}
                          baseColor="#1f2937"
                          highlightColor="#374151"
                        />
                        <Skeleton
                          height={12}
                          width={40}
                          baseColor="#1f2937"
                          highlightColor="#374151"
                        />
                        <Skeleton
                          height={12}
                          width={40}
                          baseColor="#1f2937"
                          highlightColor="#374151"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </Masonry>
          <style>{`
            .feed-item-wrapper {
              animation: fadeIn 0.5s ease-in;
              transition: all 0.3s ease-in-out;
            }
            @keyframes fadeIn {
              from {
                opacity: 0;
                transform: translateY(10px);
              }
              to {
                opacity: 1;
                transform: translateY(0);
              }
            }
          `}</style>
        </div>
      )}

      {enableInfiniteScroll && hasMore && !isLoading && (
        <div ref={observerTarget} className="py-8 text-center">
          <p className="text-gray-400">Scroll for more...</p>
        </div>
      )}

      {!hasMore && items.length > 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>No more items to load</p>
        </div>
      )}

      {selectedContent && contentHistory && type === "content" && (
        <ContentDetailComponent
          content={selectedContent}
          onClose={handleCloseDetail}
          liked={contentHistory.liked}
          pinned={contentHistory.pinned}
          likes={contentHistory.likes}
          pins={contentHistory.pins}
          comments={contentHistory.comments}
          reports={contentHistory.reports}
          onLikeClick={(newLike) => {
            setContentHistory({ ...contentHistory, likes: newLike });
          }}
          onPinClick={(newPin) => {
            setContentHistory({ ...contentHistory, pins: newPin });
          }}
          onCommentClick={(newComment) => {
            setContentHistory({ ...contentHistory, comments: newComment });
          }}
          onlikedChange={(liked) => {
            setContentHistory({ ...contentHistory, liked });
          }}
          onpinnedChange={(pinned) => {
            setContentHistory({ ...contentHistory, pinned });
          }}
        />
      )}

      {selectedContent && contentHistory && type === "post" && (
        <PostDetailComponent
          post={selectedContent}
          onClose={handleCloseDetail}
          liked={contentHistory.liked}
          pinned={contentHistory.pinned}
          likes={contentHistory.likes}
          pins={contentHistory.pins}
          comments={contentHistory.comments}
          onLikeClick={(newLike) => {
            setContentHistory({ ...contentHistory, likes: newLike });
          }}
          onCommentClick={(newComment) => {
            setContentHistory({ ...contentHistory, comments: newComment });
          }}
          onPinClick={(newPin) => {
            setContentHistory({ ...contentHistory, pins: newPin });
          }}
          onLiked={(liked) => {
            setContentHistory({ ...contentHistory, liked });
          }}
          onPinned={(pinned) => {
            setContentHistory({ ...contentHistory, pinned });
          }}
        />
      )}
    </div>
  );
}
