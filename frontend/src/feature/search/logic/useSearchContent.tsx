import { useState, useCallback } from "react";
import { useAuthContext } from "@/feature/auth/context/AuthContext";
import useContentService from "@/shared/hooks/useContentService";
import useHistoryService from "@/shared/hooks/useHistoryService";
import type { FullContentWithHistoryProps } from "@/feature/content/components/models/FullContentWithHistory";

export function useSearchContent() {
  const { user, isLoading } = useAuthContext();
  const { findAllGlobalPage } = useContentService();
  const { getByUser } = useHistoryService();

  const [allCursor, setAllCursor] = useState(0);
  const [areaId, setAreaId] = useState(1);

  const loadMore = useCallback(async (): Promise<
    FullContentWithHistoryProps[]
  > => {
    console.log("Attempting to load more content...", isLoading);
    if (isLoading) {
      console.log("User data is still loading, cannot load more content yet.");
      return [];
    }

    console.log("Loading more content for search page");
    console.log("User:", user);

    // Fetch content with pagination
    const response = await findAllGlobalPage(
      user?.area_id || areaId,
      allCursor,
      10
    );

    if (response) {
      setAllCursor(response.currentPage || 0);
      setAreaId(response.area_id || 1);
      console.log("All Cursor:", response.currentPage);
      console.log("Loaded content:", response.contents);

      // Fetch user history if user is logged in
      if (user) {
        const histories = await getByUser(user.user_id);

        if (histories) {
          // Merge history with content
          const mergedContent = response.contents.map((item) => {
            const userHistory = histories.find(
              (h) => h.content_id === item.content_id
            );
            return {
              ...item,
              liked: userHistory?.liked || false,
              pinned: userHistory?.pinned || false,
            };
          });
          return mergedContent;
        }
      }

      // Return content without history if user is not logged in
      return response.contents.map((item) => ({
        ...item,
        liked: false,
        pinned: false,
      }));
    }

    return [];
  }, [user, allCursor, areaId, isLoading, findAllGlobalPage, getByUser]);

  const resetCursor = useCallback(() => {
    setAllCursor(0);
  }, []);

  return {
    loadMore,
    resetCursor,
  };
}
