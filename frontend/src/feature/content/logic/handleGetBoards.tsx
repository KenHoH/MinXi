import { useAuthContext } from "@/feature/auth/context/AuthContext";
import type { BoardDto } from "@/service/api/models/BoardDto";
import type { FullContentDto } from "@/service/api/models/FullContentDto";
import useBoardService from "@/shared/hooks/useBoardService";

export const getBoards = async (
  pinned: boolean,
  content: FullContentDto,
  setUserBoards: React.Dispatch<React.SetStateAction<BoardDto[]>>,
  setPinnedBoardId: React.Dispatch<React.SetStateAction<number | null>>
) => {
  const { user } = useAuthContext();
  const { getBoardByUser } = useBoardService();
  if (!user) return;
  const boards = await getBoardByUser(user.user_id, user.area_id);
  setUserBoards(boards || []);
  console.log("Fetched user boards:", boards);

  // check if content is pinned and boards exist
  if (pinned && boards) {
    for (const board of boards) {
      if (board.contents?.some((c) => c.content_id === content.content_id)) {
        setPinnedBoardId(board.board_id);
        break;
      }
    }
  }
};
