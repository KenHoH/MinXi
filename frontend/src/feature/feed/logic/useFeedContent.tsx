import { useState, useCallback } from "react";
import { useAuthContext } from "@/feature/auth/context/AuthContext";
import useContentService from "@/shared/hooks/useContentService";
import useAlgorithmService from "@/shared/hooks/useAlgorithmService";
import type { BoardDto, FullContentDto } from "@/service/api";

export function useFeedContent(
  currentFilter: string,
  userBoards: BoardDto[],
  boardContentsMap: Map<number, FullContentDto[]>
) {
  const { user } = useAuthContext();
  const { findAllGlobalPage, getFollowingContent, getFriendContent } =
    useContentService();
  const { findFyp } = useAlgorithmService();

  const [allCursor, setAllCursor] = useState(0);
  const [fypCursor, setFypCursor] = useState(0);
  const [friendCursor, setFriendCursor] = useState(0);
  const [followingCursor, setFollowingCursor] = useState(0);

  const loadMore = useCallback(async () => {
    if (!user) {
      const res = await findAllGlobalPage(1, allCursor, 10);
      setAllCursor(res?.currentPage || 0);
      return res?.contents || [];
    }

    let result: FullContentDto[] = [];
    let response = null;

    if (currentFilter === "All") {
      response = await findFyp(user.area_id, fypCursor);
      setFypCursor(response?.currentPage || 0);
      result = response?.contents || [];
    } else if (currentFilter === "Following") {
      response = await getFollowingContent(
        user.user_id,
        user.area_id,
        followingCursor
      );
      setFollowingCursor(response?.currentPage || 0);
      result = response?.contents || [];
    } else if (currentFilter === "Friends") {
      response = await getFriendContent(
        user.user_id,
        user.area_id,
        friendCursor
      );
      setFriendCursor(response?.currentPage || 0);
      result = response?.contents || [];
    } else {
      const board = userBoards.find((b) => b.title === currentFilter);
      if (board) result = boardContentsMap.get(board.board_id) || [];
    }

    return result;
  }, [
    currentFilter,
    user,
    allCursor,
    fypCursor,
    friendCursor,
    followingCursor,
    userBoards,
    boardContentsMap,
  ]);

  return { loadMore };
}
