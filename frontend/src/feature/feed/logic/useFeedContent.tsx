import { useState, useCallback, useEffect } from "react";
import { useAuthContext } from "@/feature/auth/context/AuthContext";
import useContentService from "@/shared/hooks/useContentService";
import useAlgorithmService from "@/shared/hooks/useAlgorithmService";
import type { BoardDto, FullContentDto } from "@/service/api";

export function useFeedContent(
  currentFilter: string,
  userBoards: BoardDto[],
  boardContentsMap: Map<number, FullContentDto[]>
) {
  const { user, isLoading } = useAuthContext();
  const { findAllGlobalPage, getFollowingContent, getFriendContent } =
    useContentService();
  const { findFyp } = useAlgorithmService();

  const [allCursor, setAllCursor] = useState(0);
  const [areaId, setAreaId] = useState(1);
  const [fypCursor, setFypCursor] = useState(0);
  const [friendCursor, setFriendCursor] = useState(0);
  const [followingCursor, setFollowingCursor] = useState(0);

  const loadMore = useCallback(async () => {
    console.log("Attempting to load more content...", isLoading);
    if (isLoading) {
      console.log("User data is still loading, cannot load more content yet.");
      return [];
    }

    console.log("Loading more content for filter:", currentFilter);
    console.log("User:", user);

    if (!user && !isLoading) {
      const res = await findAllGlobalPage(areaId, allCursor, 10);
      setAllCursor(res?.currentPage || 0);
      setAreaId(res?.area_id || 1);
      console.log("All Cursor:", allCursor);
      console.log("Load more for guest user:", res);
      return res?.contents || [];
    }

    if (!user) {
      console.log(
        "No user found after loading, cannot load personalized content."
      );
      return [];
    }

    let result: FullContentDto[] = [];
    let response = null;

    if (currentFilter === "All") {
      response = await findFyp(user.area_id, fypCursor);
      setFypCursor(response?.currentPage || 0);
      console.log("FYP Cursor:", fypCursor);
      console.log("Load more for FYP:", response);
      if (!response || response.contents.length === 0) {
        const res = await findAllGlobalPage(areaId, allCursor, 10);
        setAllCursor(res?.currentPage || 0);
        setAreaId(res?.area_id || 1);
        console.log("Because FYP Exhaust All Cursor:", allCursor);
        console.log("Load more for guest user:", res);
        result = res?.contents || [];
      } else {
        result = response?.contents || [];
      }
    } else if (currentFilter === "Following") {
      response = await getFollowingContent(
        user.user_id,
        user.area_id,
        followingCursor
      );
      setFollowingCursor(response?.currentPage || 0);
      console.log("Following Cursor:", followingCursor);
      console.log("Load more for Following:", response);
      result = response?.contents || [];
    } else if (currentFilter === "Friends") {
      response = await getFriendContent(
        user.user_id,
        user.area_id,
        friendCursor
      );
      setFriendCursor(response?.currentPage || 0);
      console.log("Friend Cursor:", friendCursor);
      console.log("Load more for Friends:", response);
      result = response?.contents || [];
    } else {
      const board = userBoards.find((b) => b.title === currentFilter);
      if (board) result = boardContentsMap.get(board.board_id) || [];
      console.log("Load more for Board:", board, result);
    }

    return result;
  }, [
    currentFilter,
    user,
    allCursor,
    isLoading,
    fypCursor,
    friendCursor,
    followingCursor,
    userBoards,
    boardContentsMap,
  ]);

  useEffect(() => {
    console.log("Filter changed to:", currentFilter);
    setAllCursor(0);
    setFypCursor(0);
    setFriendCursor(0);
    setFollowingCursor(0);
    setAreaId(1);
  }, [currentFilter]);

  return { loadMore };
}
