import { CommentService } from "../../service/api/services/CommentService";
import type { CommentReq } from "../../service/api/models/CommentReq";
import type { CommentRes } from "../../service/api/models/CommentRes";
import type { DeleteCommentRes } from "../../service/api/models/DeleteCommentRes";
import useApiCall from "./useApiCall";

export default function useCommentService() {
  const { call, data, loading, error } = useApiCall();

  const create = (dto: CommentReq) =>
    call<CommentRes>(() => CommentService.commentControllerCreate(dto));

  const getComment = (contentId: number) =>
    call<CommentRes[]>(() =>
      CommentService.commentControllerGetComment(contentId)
    );

  const deleteComment = (commentId: number) =>
    call<DeleteCommentRes>(() =>
      CommentService.commentControllerDeleteComment(commentId)
    );

  return {
    create,
    getComment,
    deleteComment,
    result: data,
    loading,
    error,
  };
}
