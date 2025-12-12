import type { BoardDto } from "@/service/api/models/BoardDto";
import type { FullContentDto } from "@/service/api/models/FullContentDto";

export const getBoards = async (
  userId: number,
  areaId: number,
  pinned: boolean,
  content: FullContentDto,
  setUserBoards: React.Dispatch<React.SetStateAction<BoardDto[]>>,
  setPinnedBoardId: React.Dispatch<React.SetStateAction<number | null>>,
  getBoardByUser: (userId: number, areaId: number) => Promise<BoardDto[] | null>
) => {
  const boards = await getBoardByUser(userId, areaId);
  setUserBoards(boards || []);
  console.log("Fetched user boards:", boards);

  if (pinned && boards) {
    for (const board of boards) {
      if (board.contents?.some((c) => c.content_id === content.content_id)) {
        setPinnedBoardId(board.board_id);
        break;
      }
    }
  }
};
