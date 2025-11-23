import { useState, useCallback } from "react";
import {
  BoardService,
  type CreateBoardDto,
  type AddContentDto,
  type RemoveContentDto,
  type UpdateContentDto,
  type BoardDto,
  type Ack,
} from "@/services/api";
import { useToast } from "../context/ToastContext";
import { useLoading } from "../context/LoadingContext";

interface UseBoardServiceReturn {
  // State - typed DTOs
  boardData: BoardDto | null;
  boardsData: BoardDto[] | null;
  ackData: Ack | null;
  error: string | null;
  isLoading: boolean;

  // Methods
  createBoard: (dto: CreateBoardDto) => Promise<BoardDto>;
  setPrivate: (id: number) => Promise<Ack>;
  setPublic: (id: number) => Promise<Ack>;
  addContent: (boardId: number, dto: AddContentDto) => Promise<Ack>;
  removeContent: (boardId: number, dto: RemoveContentDto) => Promise<Ack>;
  updateContent: (boardId: number, dto: UpdateContentDto) => Promise<BoardDto>;
  getBoardsByUser: (userId: number) => Promise<BoardDto[]>;
  resetError: () => void;
}

export default function useBoardService(): UseBoardServiceReturn {
  const { showToast } = useToast();
  const { showLoading, hideLoading } = useLoading();

  const [boardData, setBoardData] = useState<BoardDto | null>(null);
  const [boardsData, setBoardsData] = useState<BoardDto[] | null>(null);
  const [ackData, setAckData] = useState<Ack | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const resetError = useCallback(() => setError(null), []);

  const handleError = useCallback(
    (err: unknown, defaultMessage: string) => {
      const message = err instanceof Error ? err.message : defaultMessage;
      setError(message);
      showToast(message);
    },
    [showToast]
  );

  const createBoard = useCallback(
    async (dto: CreateBoardDto): Promise<BoardDto> => {
      setIsLoading(true);
      showLoading();
      resetError();
      try {
        const result = await BoardService.boardControllerCreate(dto);
        setBoardData(result);
        showToast("Board created successfully");
        return result;
      } catch (err) {
        handleError(err, "Failed to create board. Please try again.");
        throw err;
      } finally {
        setIsLoading(false);
        hideLoading();
      }
    },
    [showLoading, hideLoading, resetError, handleError, showToast]
  );

  const setPrivate = useCallback(
    async (id: number): Promise<Ack> => {
      setIsLoading(true);
      showLoading();
      resetError();
      try {
        const result = await BoardService.boardControllerSetPrivate(id);
        setAckData(result);
        showToast("Board set to private");
        return result;
      } catch (err) {
        handleError(err, "Failed to set board as private. Please try again.");
        throw err;
      } finally {
        setIsLoading(false);
        hideLoading();
      }
    },
    [showLoading, hideLoading, resetError, handleError, showToast]
  );

  const setPublic = useCallback(
    async (id: number): Promise<Ack> => {
      setIsLoading(true);
      showLoading();
      resetError();
      try {
        const result = await BoardService.boardControllerSetPublic(id);
        setAckData(result);
        showToast("Board set to public");
        return result;
      } catch (err) {
        handleError(err, "Failed to set board as public. Please try again.");
        throw err;
      } finally {
        setIsLoading(false);
        hideLoading();
      }
    },
    [showLoading, hideLoading, resetError, handleError, showToast]
  );

  const addContent = useCallback(
    async (boardId: number, dto: AddContentDto): Promise<Ack> => {
      setIsLoading(true);
      resetError();
      try {
        const result = await BoardService.boardControllerAddContent(
          boardId,
          dto
        );
        setAckData(result);
        showToast("Content added to board");
        return result;
      } catch (err) {
        handleError(err, "Failed to add content to board. Please try again.");
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [resetError, handleError, showToast]
  );

  const removeContent = useCallback(
    async (boardId: number, dto: RemoveContentDto): Promise<Ack> => {
      setIsLoading(true);
      resetError();
      try {
        const result = await BoardService.boardControllerRemoveContent(
          boardId,
          dto
        );
        setAckData(result);
        showToast("Content removed from board");
        return result;
      } catch (err) {
        handleError(
          err,
          "Failed to remove content from board. Please try again."
        );
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [resetError, handleError, showToast]
  );

  const updateContent = useCallback(
    async (boardId: number, dto: UpdateContentDto): Promise<BoardDto> => {
      setIsLoading(true);
      resetError();
      try {
        const result = await BoardService.boardControllerUpdateContent(
          boardId,
          dto
        );
        setBoardData(result);
        showToast("Content updated");
        return result;
      } catch (err) {
        handleError(err, "Failed to update content. Please try again.");
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [resetError, handleError, showToast]
  );

  const getBoardsByUser = useCallback(
    async (userId: number): Promise<BoardDto[]> => {
      setIsLoading(true);
      showLoading();
      resetError();
      try {
        const result = await BoardService.boardControllerGetBoardByUser(userId);
        setBoardsData(result);
        return result;
      } catch (err) {
        handleError(err, "Failed to fetch user boards. Please try again.");
        throw err;
      } finally {
        setIsLoading(false);
        hideLoading();
      }
    },
    [showLoading, hideLoading, resetError, handleError]
  );

  return {
    boardData,
    boardsData,
    ackData,
    error,
    isLoading,
    createBoard,
    setPrivate,
    setPublic,
    addContent,
    removeContent,
    updateContent,
    getBoardsByUser,
    resetError,
  };
}
