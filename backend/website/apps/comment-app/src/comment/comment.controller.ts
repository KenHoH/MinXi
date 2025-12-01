import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CommentService } from './comment.service';
import { ICommentService } from '@app/contracts/interfaces/app/ICommentService';
import { CommentRes } from '@app/contracts/shared-dto/comment/res/CommentRes';
import { COMMENT_MSG } from '@app/common/constants/messageEvent';
import { CommentReq } from '@app/contracts/shared-dto/comment/req/CommentReq';
import { CommentFullRes } from '@app/contracts/shared-dto/comment/res/CommentFullRes';

@Controller()
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @MessagePattern(COMMENT_MSG.create)
  async create(@Payload() dto: CommentReq): Promise<CommentRes> {
    return this.commentService.create(dto);
  }

  @MessagePattern(COMMENT_MSG.getComment)
  async getComment(@Payload() contentId: number): Promise<CommentFullRes[]> {
    return this.commentService.getComment(contentId);
  }

  @MessagePattern(COMMENT_MSG.deleteComment)
  async deleteComment(@Payload() commentId: number): Promise<any> {
    return this.commentService.deleteComment(commentId);
  }
}
