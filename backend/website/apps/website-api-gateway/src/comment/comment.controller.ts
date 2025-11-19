import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentRes } from '@app/contracts/shared-dto/comment/res/CommentRes';
import { JwtAuthGuard } from '@app/common/guard/jwt-auth-guard/jwt-auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('comment')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class CommentController {
  constructor(private readonly commentService: CommentService) {}
  @Post()
  create(@Body() dto: CommentRes) {
    return this.commentService.create(dto);
  }

  @Get(':contentId')
  getComment(@Param('contentId', ParseIntPipe) contentId: number) {
    return this.commentService.getComment(contentId);
  }

  @Delete(':commentId')
  deleteComment(@Param('commentId', ParseIntPipe) commentId: number) {
    return this.commentService.deleteComment(commentId);
  }
}
