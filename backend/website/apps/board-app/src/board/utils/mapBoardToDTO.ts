import { BoardDto } from '@app/contracts/shared-dto/board/response/board.dto';

export function mapBoardToDto(board: any): BoardDto {
  return {
    board_id: board.board_id,
    board_thumbnail: board.board_thumbnail,
    creator_id: board.creator_id,
    visibilityPrivate: board.visibilityPrivate,
    title: board.title,
    description: board.description,
    contents: board.contents.map((bc: any) => bc.content_id),
    created_at: board.created_at,
    updated_at: board.updated_at,
  };
}
