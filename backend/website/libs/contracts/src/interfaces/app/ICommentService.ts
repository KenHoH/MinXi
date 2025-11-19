import { CommentRes } from '@app/contracts/shared-dto/comment/res/CommentRes';
import { DeleteCommentRes } from '@app/contracts/shared-dto/comment/res/DeleteCommenRes';

export interface ICommentService {
  create(dto: CommentRes): Promise<CommentRes>;
  getComment(contentId: number): Promise<CommentRes[]>;
  deleteComment(commentId: number): Promise<DeleteCommentRes>;
}
