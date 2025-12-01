import { USER_MSG } from '@app/common/constants/messageEvent';
import { USER_SERVICES } from '@app/common/constants/services';
import { ContentDatabaseConnection } from '@app/common/database/content-database-connection/content-database-connection';
import { httpToRpc } from '@app/common/utils/httpToRpc';
import { ICommentService } from '@app/contracts/interfaces/app/ICommentService';
import { CommentDTO } from '@app/contracts/shared-dto/comment/CommentDTO';
import { CommentReq } from '@app/contracts/shared-dto/comment/req/CommentReq';
import { CommentFullRes } from '@app/contracts/shared-dto/comment/res/CommentFullRes';
import { CommentRes } from '@app/contracts/shared-dto/comment/res/CommentRes';
import { DeleteCommentRes } from '@app/contracts/shared-dto/comment/res/DeleteCommenRes';
import { UserDto } from '@app/contracts/shared-dto/user/user.dto';
import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class CommentService implements ICommentService {
  constructor(
    private readonly prisma: ContentDatabaseConnection,
    @Inject(USER_SERVICES.CLIENT) private readonly userClient: ClientProxy,
  ) {}

  logger = new Logger(CommentService.name);

  /**
   * Fetch user information from user service
   */
  private async getUserInfo(userId: number): Promise<UserDto | null> {
    try {
      const user = await firstValueFrom(
        this.userClient.send(USER_MSG.findOne, userId),
      );
      return user || null;
    } catch (error) {
      this.logger.error(`Failed to fetch user ${userId}:`, error.message);
      return null;
    }
  }

  async create(dto: CommentReq): Promise<CommentRes> {
    try {
      const comment = await this.prisma.comment.create({
        data: {
          creator_id: dto.creator_id,
          content_id: dto.content_id,
          text: dto.text,
          parent_id: dto.parent_id ?? null,
        },
      });

      const res: CommentRes = {
        id: comment.id,
        creator_id: comment.creator_id,
        content_id: comment.content_id,
        text: comment.text,
        created_at: comment.created_at,
        replies: [],
        parent_id: comment?.parent_id ?? undefined,
      };

      return res;
    } catch (error) {
      throw httpToRpc(
        new HttpException('Failed to create comment', HttpStatus.BAD_REQUEST),
      );
    }
  }

  async getCommentTree(parentId: number): Promise<CommentFullRes | null> {
    try {
      const comment = await this.prisma.comment.findUnique({
        where: { id: parentId },
      });

      if (!comment) {
        return null;
      }

      return await this.buildCommentTree(comment);
    } catch (error) {
      this.logger.error('Failed to get comment tree', error.message);
      throw httpToRpc(
        new HttpException(
          'Failed to get comment tree',
          HttpStatus.INTERNAL_SERVER_ERROR,
        ),
      );
    }
  }

  private async buildCommentTree(comment: any): Promise<CommentFullRes> {
    const replies = await this.prisma.comment.findMany({
      where: {
        parent_id: comment.id,
      },
      orderBy: { created_at: 'asc' },
    });

    const repliesWithChildren: CommentFullRes[] = [];
    for (const reply of replies) {
      const replyWithTree = await this.buildCommentTree(reply);
      repliesWithChildren.push(replyWithTree);
    }

    const creator = await this.getUserInfo(comment.creator_id);
    if (!creator) {
      throw new Error(`Creator with ID ${comment.creator_id} not found`);
    }
    return {
      id: comment.id,
      content_id: comment.content_id,
      creator: creator,
      text: comment.text,
      created_at: comment.created_at,
      replies: repliesWithChildren,
      parent_id: comment.parent_id ?? undefined,
    };
  }

  async getComment(contentId: number): Promise<CommentFullRes[]> {
    try {
      const allComments = await this.prisma.comment.findMany({
        where: {
          content_id: contentId,
        },
        orderBy: { created_at: 'asc' },
      });

      if (allComments.length === 0) {
        return [];
      }

      const rootComments = allComments.filter(
        (c) => !c.parent_id || c.parent_id === 0,
      );

      if (rootComments.length === 0) {
        this.logger.warn(
          `No root comments found for content ${contentId}. Returning ${allComments.length} comments as flat list.`,
        );
        const flatComments: CommentFullRes[] = [];
        for (const c of allComments) {
          const creator = await this.getUserInfo(c.creator_id);
          if (!creator) {
            continue;
          }
          flatComments.push({
            id: c.id,
            content_id: c.content_id,
            creator: creator,
            text: c.text,
            created_at: c.created_at,
            replies: [],
            parent_id: c.parent_id ?? undefined,
          });
        }
        return flatComments;
      }

      const result: CommentFullRes[] = [];
      for (const comment of rootComments) {
        const commentWithReplies = await this.buildCommentTree(comment);
        result.push(commentWithReplies);
      }

      return result;
    } catch (error) {
      this.logger.error('Failed to get comments', error.message);
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
