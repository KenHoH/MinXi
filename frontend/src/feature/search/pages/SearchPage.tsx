"use client";

import { useState, useRef, useEffect } from "react";
import { Search } from "lucide-react";
import RootLayout from "@/app/LayoutPage";
import { ContentComponent } from "@/feature/content/components/ContentComponent/ContentComponent";
import { PostComponent } from "@/feature/content/components/PostComponent/PostComponent";
import type { FullContentDto, UserDto } from "@/service/api";
import useAlgorithmService from "@/shared/hooks/useAlgorithmService";
import useUserService from "@/shared/hooks/useUserService";
import { useAuthContext } from "@/feature/auth/context/AuthContext";
import useContentService from "@/shared/hooks/useContentService";

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<FullContentDto[]>([]);
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [searchDebounceTimer, setSearchDebounceTimer] =
    useState<NodeJS.Timeout | null>(null);

  const [loggedUser, setLoggedUser] = useState<UserDto | null>(null);
  const { user } = useAuthContext();
  const { findUserById } = useUserService();
  const { searchContent, findFyp } = useAlgorithmService();
  const { findAll } = useContentService();

  const [allContent, setAllContent] = useState<FullContentDto[]>([]);
  const [isAllContentLoading, setIsAllContentLoading] = useState(false);

  const searchObserverTarget = useRef<HTMLDivElement>(null);
  const allContentObserverTarget = useRef<HTMLDivElement>(null);

  const performSearch = async (query: string) => {
    if (!loggedUser) return;
    const res = await searchContent(query, loggedUser.area_id);
    if (res) {
      setSearchResults(res);
    }
    console.log("Search results:", res);
  };

  const fetchAllContent = async () => {
    if (!loggedUser) return;
    setIsAllContentLoading(true);
    const res = await findAll(loggedUser.area_id);
    if (res) {
      setAllContent(res);
    }
    setIsAllContentLoading(false);
  };

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

  const renderItem = (item: FullContentDto) => {
    const isPost = item.post_type === "post";
    const isContent = item.post_type === "image" || item.post_type === "video";

    if (isContent) {
      return (
        <ContentComponent
          key={item.content_id}
          content={item as FullContentDto}
        />
      );
    } else if (isPost) {
      return (
        <PostComponent key={item.content_id} post={item as FullContentDto} />
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
    if (loggedUser) {
      fetchAllContent();
    }
  }, [loggedUser]);

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
                      className="mb-4"
                      style={{ breakInside: "avoid", pageBreakInside: "avoid" }}
                    >
                      {renderItem(item)}
                    </div>
                  ))
                )}
              </div>

              {/* Search Results Loading Indicator */}
              {isSearchLoading && (
                <div className="py-8 text-center">
                  <div className="flex justify-center items-center">
                    <div className="w-8 h-8 border-4 border-burgundy-600 border-t-burgundy-400 rounded-full animate-spin" />
                  </div>
                </div>
              )}

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
                    className="mb-4"
                    style={{ breakInside: "avoid", pageBreakInside: "avoid" }}
                  >
                    {renderItem(item)}
                  </div>
                ))
              )}
            </div>

            {/* Find All Content Loading Indicator */}
            {isAllContentLoading && (
              <div className="py-8 text-center">
                <div className="flex justify-center items-center">
                  <div className="w-8 h-8 border-4 border-burgundy-600 border-t-burgundy-400 rounded-full animate-spin" />
                </div>
              </div>
            )}

            {/* Find All Content Scroll Trigger */}
            <div ref={allContentObserverTarget} className="py-4" />
          </div>
        </div>
      </div>
    </RootLayout>
  );
}
