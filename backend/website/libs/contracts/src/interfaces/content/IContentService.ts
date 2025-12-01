import { Ack } from '@app/contracts/shared-dto/ack.dto';
import { CreateFileDto } from '@app/contracts/shared-dto/content/req/CreateFile.req.dto';
import { CreatePostDto } from '@app/contracts/shared-dto/content/req/CreatePost.req.dto';
import { FileRes } from '@app/contracts/shared-dto/content/res/file.res.dto';
import { FileDto } from '@app/contracts/shared-dto/content/res/file.dto';
import { FullContentDto } from '@app/contracts/shared-dto/content/res/full.content.dto';
import { deltaDto } from '@app/contracts/shared-dto/user/delta.dto';
import { PageContentRes } from '@app/contracts/shared-dto/content/res/page.content.dto';

export interface IContentService {
  create(dto: CreatePostDto): Promise<FullContentDto>;
  createFile(dto: CreateFileDto): Promise<FileRes>;
  updateView(content_id: number, area_id: number, dto: deltaDto): Promise<Ack>;
  updateLike(content_id: number, area_id: number, dto: deltaDto): Promise<Ack>;
  updatePin(content_id: number, area_id: number, dto: deltaDto): Promise<Ack>;
  updateComment(
    content_id: number,
    area_id: number,
    dto: deltaDto,
  ): Promise<Ack>;
  updateReport(
    content_id: number,
    area_id: number,
    dto: deltaDto,
  ): Promise<Ack>;
  setPrivate(content_id: number, area_id: number): Promise<Ack>;
  setPublic(content_id: number, area_id: number): Promise<Ack>;
  findAll(area_id: number): Promise<FullContentDto[]>;

  findAllPage(
    area_id: number,
    page: number,
    limit: number,
  ): Promise<PageContentRes>;

  findOne(content_id: number, area_id: number): Promise<FullContentDto>;
  getByUser(creator_id: number): Promise<FullContentDto[]>;
  getByUserAll(creator_id: number): Promise<FullContentDto[]>;
  getByUserAllPublic(creator_id: number): Promise<FullContentDto[]>;
  getFile(contentId: number, areaId: number): Promise<FileDto>;
  getFiles(contentId: number, areaId: number): Promise<FileDto[]>;

  getAncestorPost(contentId: number, areaId: number): Promise<FullContentDto[]>;
  getFullPost(contentId: number, areaId: number): Promise<FullContentDto>;
  getFollowingContent(userId: number): Promise<FullContentDto[]>;
  getFriendContent(userId: number): Promise<FullContentDto[]>;
  getLikedByUser(userId: number): Promise<FullContentDto[]>;
  getPinnedByUser(userId: number): Promise<FullContentDto[]>;
  getChildPost(parent_id: number): Promise<FullContentDto[]>;
  remove(content_id: number, area_id: number): Promise<Ack>;
}
