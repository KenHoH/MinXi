import { CommentFullRes } from '@app/contracts/shared-dto/comment/res/CommentFullRes';
import { CommentRes } from '@app/contracts/shared-dto/comment/res/CommentRes';
import { DeleteCommentRes } from '@app/contracts/shared-dto/comment/res/DeleteCommenRes';

export interface ICommentService {
  create(dto: CommentRes): Promise<CommentRes>;
  getComment(contentId: number): Promise<CommentFullRes[]>;
  deleteComment(commentId: number): Promise<DeleteCommentRes>;
}
