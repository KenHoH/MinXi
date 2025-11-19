import { COMMENT_MSG } from '@app/common/constants/messageEvent';
import { COMMENT_SERVICES } from '@app/common/constants/services';
import { ICommentService } from '@app/contracts/interfaces/app/ICommentService';
import { CommentReq } from '@app/contracts/shared-dto/comment/req/CommentReq';
import { CommentRes } from '@app/contracts/shared-dto/comment/res/CommentRes';
import { DeleteCommentRes } from '@app/contracts/shared-dto/comment/res/DeleteCommenRes';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { first, firstValueFrom } from 'rxjs';

@Injectable()
export class CommentService implements ICommentService {
  constructor(
    @Inject(COMMENT_SERVICES.CLIENT) private readonly client: ClientProxy,
  ) {}
  async create(dto: CommentReq): Promise<CommentRes> {
    return await firstValueFrom(this.client.send(COMMENT_MSG.create, dto));
  }
  async getComment(contentId: number): Promise<CommentRes[]> {
    return await firstValueFrom(
      this.client.send(COMMENT_MSG.getComment, contentId),
    );
  }
  async deleteComment(commentId: number): Promise<DeleteCommentRes> {
    return await firstValueFrom(
      this.client.send(COMMENT_MSG.deleteComment, commentId),
    );
  }
}
