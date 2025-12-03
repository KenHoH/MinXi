import { useState, useEffect, useCallback } from "react";
import { useAuthContext } from "@/feature/auth/context/AuthContext";
import useBoardService from "@/shared/hooks/useBoardService";
import type { BoardDto } from "@/service/api";

export function useUserBoards() {
  const { user } = useAuthContext();
  const { getBoardByUser, getContentByBoardId } = useBoardService();
  const [userBoards, setUserBoards] = useState<BoardDto[]>([]);
  const [boardContentsMap, setBoardContentsMap] = useState(new Map());

  const fetchUserBoards = useCallback(async () => {
    if (!user) return;
    const boards = await getBoardByUser(user.user_id, user.area_id);
    setUserBoards(boards ?? []);
  }, [user]);

  const fetchBoardContent = useCallback(
    async (boardId: number) => {
      if (!user) return;
      const content = await getContentByBoardId(boardId, user.area_id);
      setBoardContentsMap((prev) => new Map(prev).set(boardId, content));
    },
    [user]
  );

  useEffect(() => {
    fetchUserBoards();
  }, [fetchUserBoards]);

  useEffect(() => {
    userBoards.forEach((board) => {
      fetchBoardContent(board.board_id);
    });
  }, [userBoards, fetchBoardContent]);

  return { userBoards, boardContentsMap, fetchBoardContent };
}
