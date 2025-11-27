import { ContentDatabaseConnection } from '@app/common/database/content-database-connection/content-database-connection';
import { httpToRpc } from '@app/common/utils/httpToRpc';
import { ICommentService } from '@app/contracts/interfaces/app/ICommentService';
import { CommentDTO } from '@app/contracts/shared-dto/comment/CommentDTO';
import { CommentReq } from '@app/contracts/shared-dto/comment/req/CommentReq';
import { CommentRes } from '@app/contracts/shared-dto/comment/res/CommentRes';
import { DeleteCommentRes } from '@app/contracts/shared-dto/comment/res/DeleteCommenRes';
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';

@Injectable()
export class CommentService implements ICommentService {
  constructor(private readonly prisma: ContentDatabaseConnection) {}

  logger = new Logger(CommentService.name);

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

  async getCommentTree(parentId: number): Promise<CommentRes | null> {
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

  private async buildCommentTree(comment: any): Promise<CommentRes> {
    const replies = await this.prisma.comment.findMany({
      where: {
        parent_id: comment.id,
      },
      orderBy: { created_at: 'asc' },
    });

    const repliesWithChildren: CommentRes[] = [];
    for (const reply of replies) {
      const replyWithTree = await this.buildCommentTree(reply);
      repliesWithChildren.push(replyWithTree);
    }

    return {
      id: comment.id,
      creator_id: comment.creator_id,
      content_id: comment.content_id,
      text: comment.text,
      created_at: comment.created_at,
      replies: repliesWithChildren,
      parent_id: comment.parent_id ?? undefined,
    };
  }

  async getComment(contentId: number): Promise<CommentRes[]> {
    try {
      // Fetch ALL comments for this content (including those with parent_id)
      const allComments = await this.prisma.comment.findMany({
        where: {
          content_id: contentId,
        },
        orderBy: { created_at: 'asc' },
      });

      if (allComments.length === 0) {
        return [];
      }

      // Separate root comments from replies
      const rootComments = allComments.filter(
        (c) => !c.parent_id || c.parent_id === 0,
      );

      // If no root comments exist, all comments are orphaned replies
      // Return them flat to avoid data loss
      if (rootComments.length === 0) {
        this.logger.warn(
          `No root comments found for content ${contentId}. Returning ${allComments.length} comments as flat list.`,
        );
        return allComments.map((c) => ({
          id: c.id,
          creator_id: c.creator_id,
          content_id: c.content_id,
          text: c.text,
          created_at: c.created_at,
          replies: [],
          parent_id: c.parent_id ?? undefined,
        }));
      }

      // Build tree for each root comment
      const result: CommentRes[] = [];
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
