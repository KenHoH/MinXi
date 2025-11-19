import { ContentDatabaseConnection } from '@app/common/database/content-database-connection/content-database-connection';
import { httpToRpc } from '@app/common/utils/httpToRpc';
import { ICommentService } from '@app/contracts/interfaces/app/ICommentService';
import { CommentRes } from '@app/contracts/shared-dto/comment/res/CommentRes';
import { DeleteCommentRes } from '@app/contracts/shared-dto/comment/res/DeleteCommenRes';
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';

@Injectable()
export class CommentService implements ICommentService {
  constructor(private readonly prisma: ContentDatabaseConnection) {}

  logger = new Logger(CommentService.name);

  async create(dto: CommentRes): Promise<CommentRes> {
    try {
      const comment = this.prisma.comment.create({
        data: {
          creator_id: dto.creator_id,
          content_id: dto.content_id,
          text: dto.text,
        },
      });

      return comment;
    } catch (error) {
      throw httpToRpc(
        new HttpException('Failed to create comment', HttpStatus.BAD_REQUEST),
      );
    }
  }
  async getComment(contentId: number): Promise<CommentRes[]> {
    try {
      const comments = await this.prisma.comment.findMany({
        where: {
          content_id: contentId,
        },
      });
      return comments;
    } catch (error) {
      throw httpToRpc(
        new HttpException('Failed to get comments', HttpStatus.BAD_REQUEST),
      );
    }
  }
  async deleteComment(commentId: number): Promise<DeleteCommentRes> {
    try {
      const comment = await this.prisma.comment.delete({
        select: {
          id: true,
        },
        where: {
          id: commentId,
        },
      });
      return comment;
    } catch (error) {
      throw httpToRpc(
        new HttpException('Failed to delete comment', HttpStatus.BAD_REQUEST),
      );
    }
  }
}
