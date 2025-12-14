"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Search } from "lucide-react";
import RootLayout from "@/app/LayoutPage";
import { ContentComponent } from "@/feature/content/components/ContentComponent/ContentComponent";
import { PostComponent } from "@/feature/content/components/PostComponent/PostComponent";
import type { FullContentDto, UserDto } from "@/service/api";
import useAlgorithmService from "@/shared/hooks/useAlgorithmService";
import useUserService from "@/shared/hooks/useUserService";
import { useAuthContext } from "@/feature/auth/context/AuthContext";
import useContentService from "@/shared/hooks/useContentService";
import { useSearchContent } from "../logic/useSearchContent";
import type { FullContentWithHistoryProps } from "@/feature/content/components/models/FullContentWithHistory";
import useHistoryService from "@/shared/hooks/useHistoryService";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<
    FullContentWithHistoryProps[]
  >([]);
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [searchDebounceTimer, setSearchDebounceTimer] =
    useState<NodeJS.Timeout | null>(null);

  const [loggedUser, setLoggedUser] = useState<UserDto | null>(null);
  const { user, isLoading: authLoading } = useAuthContext();
  const { findUserById } = useUserService();
  const { searchContent } = useAlgorithmService();
  const { getByUser } = useHistoryService();

  const [allContent, setAllContent] = useState<FullContentWithHistoryProps[]>(
    []
  );
  const [isAllContentLoading, setIsAllContentLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const { loadMore, resetCursor } = useSearchContent();

  const searchObserverTarget = useRef<HTMLDivElement>(null);
  const allContentObserverTarget = useRef<HTMLDivElement>(null);

  const performSearch = async (query: string) => {
    if (!loggedUser) return;
    const res = await searchContent(query, loggedUser.area_id);
    if (res) {
      // Merge with user history if user is logged in
      if (user) {
        const histories = await getByUser(user.user_id);
        if (histories) {
          const mergedResults = res.map((item) => {
            const userHistory = histories.find(
              (h) => h.content_id === item.content_id
            );
            return {
              ...item,
              liked: userHistory?.liked || false,
              pinned: userHistory?.pinned || false,
            };
          });
          setSearchResults(mergedResults);
          console.log("Search results with history:", mergedResults);
          return;
        }
      }
      // Set results without history if no user or no history
      setSearchResults(
        res.map((item) => ({ ...item, liked: false, pinned: false }))
      );
    }
    console.log("Search results:", res);
  };

  const loadMoreContent = useCallback(async () => {
    if (isAllContentLoading || !hasMore) return;

    setIsAllContentLoading(true);
    try {
      const newItems = await loadMore();

      if (newItems.length === 0) {
        setHasMore(false);
      } else {
        await new Promise((resolve) => setTimeout(resolve, 300));

        setAllContent((prev) => [...prev, ...newItems]);

        // Delay 1 second before removing skeleton
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    } catch (error) {
      console.error("Failed to load more items:", error);
      setHasMore(false);
    } finally {
      setIsAllContentLoading(false);
    }
  }, [isAllContentLoading, hasMore, loadMore]);

  const handleSearchChange = async (query: string) => {
    setSearchQuery(query);
    setSearchResults([]);
    setIsSearchLoading(false);

    if (searchDebounceTimer) {
      clearTimeout(searchDebounceTimer);
    }

    if (query.trim()) {
      const timer = setTimeout(() => {
        performSearch(query);
      }, 1000);
      setSearchDebounceTimer(timer);
    }
  };

  const renderItem = (item: FullContentWithHistoryProps) => {
    const isPost = item.post_type === "post";
    const isContent = item.post_type === "image" || item.post_type === "video";

    if (isContent) {
      return (
        <ContentComponent
          content={item}
          liked={item.liked ?? false}
          pinned={item.pinned ?? false}
        />
      );
    } else if (isPost) {
      return (
        <PostComponent
          post={item}
          liked={item.liked ?? false}
          pinned={item.pinned ?? false}
        />
      );
    }

    return null;
  };

  useEffect(() => {
    const fetchLoggedUser = async () => {
      if (!user) return;
      const res = await findUserById(user.user_id);
      if (res) {
        setLoggedUser(res);
        console.log("Logged user fetched:", res);
      }
    };
    fetchLoggedUser();
  }, [user]);

  useEffect(() => {
    if (!authLoading) {
      // Reset and load initial content
      setAllContent([]);
      setHasMore(true);
      resetCursor();
      loadMoreContent();
    }
  }, [user, authLoading]);

  // Infinite scroll observer for all content
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (
          entries[0].isIntersecting &&
          hasMore &&
          !isAllContentLoading &&
          allContent.length !== 0
        ) {
          loadMoreContent();
        }
      },
      { threshold: 0.2, rootMargin: "100px" }
    );

    if (allContentObserverTarget.current) {
      observer.observe(allContentObserverTarget.current);
    }

    return () => observer.disconnect();
  }, [loadMoreContent, hasMore, isAllContentLoading, allContent.length]);

  return (
    <RootLayout>
      <div className="w-full min-h-screen bg-dark-900 flex flex-col justify-start items-center">
        <div className="w-3/4 pt-4 mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search posts, content, and people..."
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full bg-dark-800 border border-dark-700 rounded-lg pl-10 pr-4 py-2 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-burgundy-600"
            />
          </div>
        </div>

        <div className="w-3/4">
          {/* ============= Section 1: Search Results ============= */}
          {searchQuery.trim() && (
            <>
              <h2 className="text-xl font-semibold text-gray-200 mb-4">
                Search Results for "{searchQuery}"
              </h2>
              <div
                className="p-4 mb-8"
                style={{
                  columnCount: "auto",
                  columnWidth: "280px",
                  columnGap: "1rem",
                }}
              >
                {searchResults.length === 0 && !isSearchLoading ? (
                  <div className="text-center py-12 text-gray-500">
                    No results found.
                  </div>
                ) : (
                  searchResults.map((item) => (
                    <div
                      key={`search-${item.post_type}-${item.content_id}`}
                      className="search-item-wrapper mb-4"
                      style={{ breakInside: "avoid", pageBreakInside: "avoid" }}
                    >
                      {renderItem(item)}
                    </div>
                  ))
                )}

                {isSearchLoading &&
                  Array.from({ length: 6 }).map((_, index) => (
                    <div
                      key={`search-skeleton-${index}`}
                      className="mb-4"
                      style={{ breakInside: "avoid", pageBreakInside: "avoid" }}
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
              </div>

              {/* Search Results Scroll Trigger */}
              <div ref={searchObserverTarget} className="py-4" />
            </>
          )}

          {/* ============= Section 2: Find All Content ============= */}
          <div>
            <h2 className="text-xl font-semibold text-gray-200 mb-4">
              {searchQuery.trim() ? "Discover More" : "All Content"}
            </h2>
            <div
              className="p-4"
              style={{
                columnCount: "auto",
                columnWidth: "280px",
                columnGap: "1rem",
              }}
            >
              {allContent.length === 0 && !isAllContentLoading ? (
                <div className="text-center py-12 text-gray-500">
                  No content available.
                </div>
              ) : (
                allContent.map((item) => (
                  <div
                    key={`all-${item.post_type}-${item.content_id}`}
                    className="search-item-wrapper mb-4"
                    style={{ breakInside: "avoid", pageBreakInside: "avoid" }}
                  >
                    {renderItem(item)}
                  </div>
                ))
              )}

              {isAllContentLoading &&
                Array.from({ length: 6 }).map((_, index) => (
                  <div
                    key={`all-skeleton-${index}`}
                    className="mb-4"
                    style={{ breakInside: "avoid", pageBreakInside: "avoid" }}
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
            </div>

            {/* Find All Content Scroll Trigger */}
            <div ref={allContentObserverTarget} className="py-4" />
          </div>
        </div>

        <style>{`
          .search-item-wrapper {
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
    </RootLayout>
  );
}
