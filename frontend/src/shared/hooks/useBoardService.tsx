import { BoardService } from "../../service/api/services/BoardService";
import type { BoardDto } from "../../service/api/models/BoardDto";
import type { Ack } from "../../service/api/models/Ack";
import type { AddContentDto } from "../../service/api/models/AddContentDto";
import type { RemoveContentDto } from "../../service/api/models/RemoveContentDto";
import type { UpdateContentDto } from "../../service/api/models/UpdateContentDto";
import type { ContentIdsResDto } from "../../service/api/models/ContentIdsResDto";
import useApiCall from "./useApiCall";
import type { FullContentDto } from "@/service/api";

interface CreateBoardFormData {
  thumbnail: Blob;
  creator_id: number;
  area_id?: number;
  title: string;
  description: string;
  visibility: boolean;
  contents?: Array<number>;
}

export default function useBoardService() {
  const { call, data, loading, error } = useApiCall();

  const create = (formData: CreateBoardFormData) =>
    call<BoardDto>(() => BoardService.boardControllerCreate(formData));

  const addContent = (boardId: number, areaId: number, dto: AddContentDto) =>
    call<Ack>(() =>
      BoardService.boardControllerAddContent(boardId, areaId, dto)
    );

  const removeContent = (
    boardId: number,
    areaId: number,
    dto: RemoveContentDto
  ) =>
    call<Ack>(() =>
      BoardService.boardControllerRemoveContent(boardId, areaId, dto)
    );

  const updateContent = (
    boardId: number,
    areaId: number,
    dto: UpdateContentDto
  ) =>
    call<BoardDto>(() =>
      BoardService.boardControllerUpdateContent(boardId, areaId, dto)
    );

  const getBoardByUser = (userId: number, areaId: number) =>
    call<BoardDto[]>(() =>
      BoardService.boardControllerGetBoardByUser(userId, areaId)
    );

  const getContentIdsByBoardId = (boardId: number) =>
    call<ContentIdsResDto>(() =>
      BoardService.boardControllerGetContentIdsByBoardId(boardId)
    );
  const getContentByBoardId = (boardId: number, areaId: number) =>
    call<FullContentDto[]>(() =>
      BoardService.boardControllerGetContentByBoardId(boardId, areaId)
    );

  const deleteBoard = (id: number) =>
    call<Ack>(() => BoardService.boardControllerDeleteBoard(id));

  const setPrivate = (id: number) =>
    call<Ack>(() => BoardService.boardControllerSetPrivate(id));

  const setPublic = (id: number) =>
    call<Ack>(() => BoardService.boardControllerSetPublic(id));

  return {
    create,
    addContent,
    removeContent,
    updateContent,
    getBoardByUser,
    getContentByBoardId,
    getContentIdsByBoardId,
    deleteBoard,
    setPrivate,
    setPublic,
    result: data,
    loading,
    error,
  };
}
