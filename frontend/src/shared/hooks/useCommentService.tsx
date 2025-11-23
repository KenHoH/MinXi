import { useState, useCallback } from "react";
import {
  CommentService,
  type CommentReq,
  type CommentRes,
  type DeleteCommentRes,
} from "@/services/api";
import { useToast } from "../context/ToastContext";
import { useLoading } from "../context/LoadingContext";

interface UseCommentServiceReturn {
  // State - typed DTOs
  commentData: CommentRes | null;
  commentsData: CommentRes[] | null;
  deleteCommentData: DeleteCommentRes | null;
  error: string | null;
  isLoading: boolean;

  // Methods
  createComment: (dto: CommentReq) => Promise<CommentRes>;
  getComments: (contentId: number) => Promise<CommentRes[]>;
  deleteComment: (commentId: number) => Promise<DeleteCommentRes>;
  resetError: () => void;
}

export default function useCommentService(): UseCommentServiceReturn {
  const { showToast } = useToast();
  const { showLoading, hideLoading } = useLoading();

  const [commentData, setCommentData] = useState<CommentRes | null>(null);
  const [commentsData, setCommentsData] = useState<CommentRes[] | null>(null);
  const [deleteCommentData, setDeleteCommentData] =
    useState<DeleteCommentRes | null>(null);
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

  const createComment = useCallback(
    async (dto: CommentReq): Promise<CommentRes> => {
      setIsLoading(true);
      resetError();
      try {
        const result = await CommentService.commentControllerCreate(dto);
        setCommentData(result);
        showToast("Comment posted successfully");
        return result;
      } catch (err) {
        handleError(err, "Failed to post comment. Please try again.");
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [resetError, handleError, showToast]
  );

  const getComments = useCallback(
    async (contentId: number): Promise<CommentRes[]> => {
      setIsLoading(true);
      showLoading();
      resetError();
      try {
        const result = await CommentService.commentControllerGetComment(
          contentId
        );
        setCommentsData(result);
        return result;
      } catch (err) {
        handleError(err, "Failed to fetch comments. Please try again.");
        throw err;
      } finally {
        setIsLoading(false);
        hideLoading();
      }
    },
    [showLoading, hideLoading, resetError, handleError]
  );

  const deleteComment = useCallback(
    async (commentId: number): Promise<DeleteCommentRes> => {
      setIsLoading(true);
      resetError();
      try {
        const result = await CommentService.commentControllerDeleteComment(
          commentId
        );
        setDeleteCommentData(result);
        showToast("Comment deleted successfully");
        return result;
      } catch (err) {
        handleError(err, "Failed to delete comment. Please try again.");
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [resetError, handleError, showToast]
  );

  return {
    commentData,
    commentsData,
    deleteCommentData,
    error,
    isLoading,
    createComment,
    getComments,
    deleteComment,
    resetError,
  };
}
