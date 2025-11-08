import { Ack } from '@app/contracts/shared-dto/ack.dto';
import { CreatePostDto } from '@app/contracts/shared-dto/content/req/CreatePost.req.dto';

export interface IContentService {
  create(dto: CreatePostDto): Promise<Ack>;
  uploadFile()
}
