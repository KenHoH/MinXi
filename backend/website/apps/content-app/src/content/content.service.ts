import { ContentDatabaseConnection } from '@app/common/database/content-database-connection/content-database-connection';
import { httpToRpc } from '@app/common/utils/httpToRpc';
import { IContentService } from '@app/contracts/interfaces/content/IContentService';
import { Ack } from '@app/contracts/shared-dto/ack.dto';
import { CreateFileDto } from '@app/contracts/shared-dto/content/req/CreateFile.req.dto';
import { CreatePostDto } from '@app/contracts/shared-dto/content/req/CreatePost.req.dto';
import { FileRes } from '@app/contracts/shared-dto/content/res/file.res.dto';
import { FileDto } from '@app/contracts/shared-dto/content/res/file.dto';
import { FullContentDto } from '@app/contracts/shared-dto/content/res/full.content.dto';
import { deltaDto } from '@app/contracts/shared-dto/user/delta.dto';
import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import {
  CONNECT_SERVICES,
  HISTORY_SERVICES,
} from '@app/common/constants/services';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import {
  CONNECTION_MSG,
  HISTORY_MSG,
} from '@app/common/constants/messageEvent';
import { mapToContent } from './utils/mapToContent';

@Injectable()
export class ContentService implements IContentService {
  private readonly logger = new Logger(ContentService.name);
  constructor(
    private readonly prisma: ContentDatabaseConnection,
    @Inject(CONNECT_SERVICES.CLIENT)
    private readonly connectionClient: ClientProxy,
    @Inject(HISTORY_SERVICES.CLIENT)
    private readonly historyClient: ClientProxy,
  ) {}

  async create(dto: CreatePostDto): Promise<FullContentDto> {
    if (dto.area_id <= 0 || dto.area_id > 3) {
      throw httpToRpc(
        new HttpException('Invalid area ID', HttpStatus.BAD_REQUEST),
      );
    }

    if (!dto.creator_id || !dto.title) {
      throw httpToRpc(
        new HttpException(
          'Missing required fields: creator_id and title',
          HttpStatus.BAD_REQUEST,
        ),
      );
    }

    if (dto.post_type !== 'post') {
      if (!dto.thumbnail || !dto.contents || dto.contents.length === 0) {
        throw httpToRpc(
          new HttpException(
            `Post type '${dto.post_type}' requires both thumbnail and contents`,
            HttpStatus.BAD_REQUEST,
          ),
        );
      }
    }

    if (!dto.contents && dto.post_type === 'post') {
      try {
        const result = await this.prisma
          .$transaction(async (tx) => {
            const content = await tx.content
              .create({
                data: {
                  creator_id: dto.creator_id,
                  parent_id: dto.parent_id ?? null,
                  title: dto.title,
                  description: dto.description,
                  post_type: dto.post_type,
                  area_id: dto.area_id,
                  published_at: new Date(dto.published_at),
                },
              })
              .catch((error) => {
                this.logger.error(
                  'Failed to create content record',
                  error.message,
                );
                throw httpToRpc(
                  new HttpException(
                    'Failed to create content record',
                    HttpStatus.INTERNAL_SERVER_ERROR,
                  ),
                );
              });

            let thumbnail: FileDto | null = null;
            if (dto.thumbnail) {
              thumbnail = await tx.file
                .create({
                  data: {
                    content_area_id: dto.area_id,
                    content_id: content.content_id,
                    filepath: dto.thumbnail,
                    type: 'thumbnail',
                  },
                })
                .catch((error) => {
                  this.logger.error(
                    'Failed to create thumbnail file',
                    error.message,
                  );
                  throw httpToRpc(
                    new HttpException(
                      'Failed to create thumbnail file',
                      HttpStatus.INTERNAL_SERVER_ERROR,
                    ),
                  );
                });
            }
            const posts: FileDto[] = [];

            const fullResponse: FullContentDto = {
              area_id: content.area_id,
              content_id: content.content_id,
              creator_id: content.creator_id,
              contents: posts,
              published_at: content.published_at,
              description: content.description,
              parent_id: content.parent_id ?? undefined,
              post_type: content.post_type,
              comments: content.comments,
              likes: content.likes,
              pins: content.pins,
              reports: content.reports,
              title: content.title,
              views: content.views,
              visibilityPrivate: content.visibilityPrivate,
              thumbnail: thumbnail,
            };

            return fullResponse;
          })
          .catch((error) => {
            if (error.status) {
              throw error;
            }
            this.logger.error('Transaction failed', error.message);
            throw httpToRpc(
              new HttpException(
                'Failed to create content - transaction rolled back',
                HttpStatus.INTERNAL_SERVER_ERROR,
              ),
            );
          });

        return result;
      } catch (error) {
        if (error.status) {
          throw error;
        }
        this.logger.error('Failed to create content', error.message);
        throw httpToRpc(
          new HttpException(
            'Failed to create content',
            HttpStatus.INTERNAL_SERVER_ERROR,
          ),
        );
      }
    }

    try {
      const result = await this.prisma
        .$transaction(async (tx) => {
          const content = await tx.content
            .create({
              data: {
                creator_id: dto.creator_id,
                parent_id: dto.parent_id ?? null,
                title: dto.title,
                description: dto.description,
                post_type: dto.post_type,
                area_id: dto.area_id,
                published_at: new Date(dto.published_at),
              },
            })
            .catch((error) => {
              this.logger.error(
                'Failed to create content record',
                error.message,
              );
              throw httpToRpc(
                new HttpException(
                  'Failed to create content record',
                  HttpStatus.INTERNAL_SERVER_ERROR,
                ),
              );
            });

          let thumbnail: FileDto | null = null;
          if (dto.thumbnail) {
            thumbnail = await tx.file
              .create({
                data: {
                  content_area_id: dto.area_id,
                  content_id: content.content_id,
                  filepath: dto.thumbnail,
                  type: 'thumbnail',
                },
              })
              .catch((error) => {
                this.logger.error(
                  'Failed to create thumbnail file',
                  error.message,
                );
                throw httpToRpc(
                  new HttpException(
                    'Failed to create thumbnail file',
                    HttpStatus.INTERNAL_SERVER_ERROR,
                  ),
                );
              });
          }

          if (
            (!dto.contents ||
              dto.contents.length === 0 ||
              dto.contents == null ||
              dto.contents == undefined) &&
            !dto.thumbnail
          ) {
            throw httpToRpc(
              new HttpException(
                'Either contents or thumbnail must be provided',
                HttpStatus.BAD_REQUEST,
              ),
            );
          }
          const posts: FileDto[] = [];
          if (dto.contents && dto.contents.length > 0) {
            for (const file of dto.contents) {
              try {
                const res = await tx.file.create({
                  data: {
                    content_area_id: dto.area_id,
                    content_id: content.content_id,
                    filepath: file.filepath,
                    type: file.type,
                  },
                });
                posts.push({
                  file_id: res.file_id,
                  filepath: res.filepath,
                  content_id: content.content_id,
                  content_area_id: content.area_id,
                  type: res.type,
                });
              } catch (error) {
                this.logger.error(
                  `Failed to create content file: ${file.filepath}`,
                  error.message,
                );
                throw httpToRpc(
                  new HttpException(
                    `Failed to create content file: ${file.filepath}`,
                    HttpStatus.INTERNAL_SERVER_ERROR,
                  ),
                );
              }
            }
          }

          const fullResponse: FullContentDto = {
            area_id: content.area_id,
            content_id: content.content_id,
            creator_id: content.creator_id,
            contents: posts,
            published_at: content.published_at,
            description: content.description,
            parent_id: content.parent_id ?? undefined,
            post_type: content.post_type,
            comments: content.comments,
            likes: content.likes,
            pins: content.pins,
            reports: content.reports,
            title: content.title,
            views: content.views,
            visibilityPrivate: content.visibilityPrivate,
            thumbnail: thumbnail,
          };

          return fullResponse;
        })
        .catch((error) => {
          if (error.status) {
            throw error;
          }
          this.logger.error('Transaction failed', error.message);
          throw httpToRpc(
            new HttpException(
              'Failed to create content - transaction rolled back',
              HttpStatus.INTERNAL_SERVER_ERROR,
            ),
          );
        });

      return result;
    } catch (error) {
      if (error.status) {
        throw error;
      }
      this.logger.error('Failed to create content', error.message);
      throw httpToRpc(
        new HttpException(
          'Failed to create content',
          HttpStatus.INTERNAL_SERVER_ERROR,
        ),
      );
    }
  }

  async createFile(dto: CreateFileDto): Promise<FileRes> {
    if (dto.area_id <= 0 || dto.area_id > 3)
      throw httpToRpc(
        new HttpException('Invalid area ID', HttpStatus.BAD_REQUEST),
      );
    try {
      await this.prisma.file.create({
        data: {
          content_area_id: dto.area_id,
          content_id: dto.content_id,
          filepath: dto.file_path,
          type: dto.type,
        },
      });
      return {
        Msg: 'File created successfully',
        Valid: true,
        path: dto.file_path,
      };
    } catch (error) {
      this.logger.error('File upload failed', error.message);
      throw httpToRpc(
        new HttpException(
          'File upload failed',
          HttpStatus.INTERNAL_SERVER_ERROR,
        ),
      );
    }
  }

  async findAll(area_id: number): Promise<FullContentDto[]> {
    if (area_id <= 0 || area_id > 3)
      throw httpToRpc(
        new HttpException('Invalid area ID', HttpStatus.BAD_REQUEST),
      );

    try {
      const result = await this.prisma
        .$transaction(async (tx) => {
          const contents = await tx.content
            .findMany({
              where: {
                area_id,
                published_at: { lte: new Date() },
                visibilityPrivate: false,
              },
              orderBy: { content_id: 'asc' },
            })
            .catch((error) => {
              this.logger.error('Failed to fetch content list', error.message);
              throw httpToRpc(
                new HttpException(
                  'Failed to fetch content list',
                  HttpStatus.INTERNAL_SERVER_ERROR,
                ),
              );
            });

          const allContents: FullContentDto[] = [];

          for (const content of contents) {
            try {
              const files = await tx.file.findMany({
                where: {
                  content_area_id: area_id,
                  content_id: content.content_id,
                },
              });

              const thumbnail = files.find((file) => file.type === 'thumbnail');

              if (!thumbnail) {
                this.logger.warn(
                  `Content ${content.content_id} missing thumbnail`,
                );
                continue;
              }

              const mappedFiles: FileDto[] = files
                .filter((file) => file.type !== 'thumbnail')
                .map((file) => ({
                  file_id: file.file_id,
                  filepath: file.filepath,
                  content_id: file.content_id,
                  content_area_id: file.content_area_id,
                  type: file.type,
                }));

              const fullContent: FullContentDto = {
                area_id: content.area_id,
                content_id: content.content_id,
                creator_id: content.creator_id,
                description: content.description,
                parent_id: content.parent_id ?? undefined,
                post_type: content.post_type,
                comments: content.comments,
                likes: content.likes,
                pins: content.pins,
                reports: content.reports,
                title: content.title,
                views: content.views,
                published_at: content.published_at,
                visibilityPrivate: content.visibilityPrivate,
                thumbnail: {
                  file_id: thumbnail.file_id,
                  filepath: thumbnail.filepath,
                  content_id: thumbnail.content_id,
                  content_area_id: thumbnail.content_area_id,
                  type: thumbnail.type,
                },
                contents: mappedFiles,
              };

              allContents.push(fullContent);
            } catch (error) {
              this.logger.error(
                `Failed to fetch files for content ${content.content_id}`,
                error.message,
              );
              throw httpToRpc(
                new HttpException(
                  `Failed to fetch files for content ${content.content_id}`,
                  HttpStatus.INTERNAL_SERVER_ERROR,
                ),
              );
            }
          }

          return allContents;
        })
        .catch((error) => {
          if (error.status) {
            throw error;
          }
          this.logger.error('Transaction failed', error.message);
          throw httpToRpc(
            new HttpException(
              'Failed to fetch content list - transaction rolled back',
              HttpStatus.INTERNAL_SERVER_ERROR,
            ),
          );
        });

      return result;
    } catch (error) {
      if (error.status) {
        throw error;
      }
      this.logger.error('Failed to fetch content list', error.message);
      throw httpToRpc(
        new HttpException(
          'Failed to fetch content list',
          HttpStatus.INTERNAL_SERVER_ERROR,
        ),
      );
    }
  }

  async findOne(content_id: number, area_id: number): Promise<FullContentDto> {
    if (area_id <= 0 || area_id > 3)
      throw httpToRpc(
        new HttpException('Invalid area ID', HttpStatus.BAD_REQUEST),
      );

    try {
      const result = await this.prisma
        .$transaction(async (tx) => {
          const content = await tx.content
            .findUnique({
              where: { content_id_area_id: { content_id, area_id } },
            })
            .catch((error) => {
              this.logger.error('Failed to fetch content', error.message);
              throw httpToRpc(
                new HttpException('Content not found', HttpStatus.NOT_FOUND),
              );
            });

          if (!content) {
            throw httpToRpc(
              new HttpException('Content not found', HttpStatus.NOT_FOUND),
            );
          }

          const files = await tx.file
            .findMany({
              where: {
                content_id: content.content_id,
                content_area_id: area_id,
              },
            })
            .catch((error) => {
              this.logger.error(
                'Failed to fetch files for content',
                error.message,
              );
              throw httpToRpc(
                new HttpException(
                  'Failed to fetch files',
                  HttpStatus.INTERNAL_SERVER_ERROR,
                ),
              );
            });

          const thumbnail = files.find((file) => file.type === 'thumbnail');
          if (!thumbnail) {
            throw httpToRpc(
              new HttpException('Thumbnail not found', HttpStatus.NOT_FOUND),
            );
          }

          const mappedFiles: FileDto[] = files
            .filter((file) => file.type !== 'thumbnail')
            .map((file) => ({
              file_id: file.file_id,
              filepath: file.filepath,
              content_id: file.content_id,
              content_area_id: file.content_area_id,
              type: file.type,
            }));

          const fullContent: FullContentDto = {
            area_id: content.area_id,
            content_id: content.content_id,
            creator_id: content.creator_id,
            description: content.description,
            parent_id: content.parent_id ?? undefined,
            post_type: content.post_type,
            comments: content.comments,
            likes: content.likes,
            pins: content.pins,
            reports: content.reports,
            title: content.title,
            views: content.views,
            published_at: content.published_at,
            visibilityPrivate: content.visibilityPrivate,
            thumbnail: {
              file_id: thumbnail.file_id,
              filepath: thumbnail.filepath,
              content_id: thumbnail.content_id,
              content_area_id: thumbnail.content_area_id,
              type: thumbnail.type,
            },
            contents: mappedFiles,
          };

          return fullContent;
        })
        .catch((error) => {
          if (error.status) {
            throw error;
          }
          this.logger.error('Transaction failed', error.message);
          throw httpToRpc(
            new HttpException(
              'Failed to fetch content - transaction rolled back',
              HttpStatus.INTERNAL_SERVER_ERROR,
            ),
          );
        });

      return result;
    } catch (error) {
      if (error.status) {
        throw error;
      }
      this.logger.error('Failed to fetch content', error.message);
      throw httpToRpc(
        new HttpException(
          'Failed to fetch content',
          HttpStatus.INTERNAL_SERVER_ERROR,
        ),
      );
    }
  }

  async getByUser(creator_id: number): Promise<FullContentDto[]> {
    try {
      const result = await this.prisma
        .$transaction(async (tx) => {
          const contents = await tx.content
            .findMany({
              where: {
                creator_id,
                published_at: { lte: new Date() },
                visibilityPrivate: false,
              },
              orderBy: { created_at: 'desc' },
            })
            .catch((error) => {
              this.logger.error('Failed to fetch user contents', error.message);
              throw httpToRpc(
                new HttpException(
                  'Failed to fetch user contents',
                  HttpStatus.INTERNAL_SERVER_ERROR,
                ),
              );
            });

          const allContents: FullContentDto[] = [];

          for (const content of contents) {
            try {
              const files = await tx.file.findMany({
                where: {
                  content_id: content.content_id,
                  content_area_id: content.area_id,
                },
              });

              const thumbnail = files.find((file) => file.type === 'thumbnail');
              if (!thumbnail) {
                this.logger.warn(
                  `Content ${content.content_id} missing thumbnail`,
                );
                continue;
              }

              const mappedFiles: FileDto[] = files
                .filter((file) => file.type !== 'thumbnail')
                .map((file) => ({
                  file_id: file.file_id,
                  filepath: file.filepath,
                  content_id: file.content_id,
                  content_area_id: file.content_area_id,
                  type: file.type,
                }));

              allContents.push({
                content_id: content.content_id,
                creator_id: content.creator_id,
                parent_id: content.parent_id ?? undefined,
                area_id: content.area_id,
                title: content.title,
                published_at: content.published_at,
                description: content.description,
                post_type: content.post_type,
                visibilityPrivate: content.visibilityPrivate,
                views: content.views,
                likes: content.likes,
                comments: content.comments,
                pins: content.pins,
                reports: content.reports,
                thumbnail: {
                  file_id: thumbnail.file_id,
                  filepath: thumbnail.filepath,
                  content_id: thumbnail.content_id,
                  content_area_id: thumbnail.content_area_id,
                  type: thumbnail.type,
                },
                contents: mappedFiles,
              });
            } catch (error) {
              this.logger.error(
                `Failed to fetch files for content ${content.content_id}`,
                error.message,
              );
              throw httpToRpc(
                new HttpException(
                  `Failed to fetch files for content ${content.content_id}`,
                  HttpStatus.INTERNAL_SERVER_ERROR,
                ),
              );
            }
          }

          return allContents;
        })
        .catch((error) => {
          if (error.status) {
            throw error;
          }
          this.logger.error('Transaction failed', error.message);
          throw httpToRpc(
            new HttpException(
              'Failed to fetch user contents - transaction rolled back',
              HttpStatus.INTERNAL_SERVER_ERROR,
            ),
          );
        });

      return result;
    } catch (error) {
      if (error.status) {
        throw error;
      }
      this.logger.error('Failed to fetch user contents', error.message);
      throw httpToRpc(
        new HttpException(
          'Failed to fetch user contents',
          HttpStatus.INTERNAL_SERVER_ERROR,
        ),
      );
    }
  }
  async getByUserAll(creator_id: number): Promise<FullContentDto[]> {
    try {
      const result = await this.prisma
        .$transaction(async (tx) => {
          const contents = await tx.content
            .findMany({
              where: { creator_id },
              orderBy: { created_at: 'desc' },
            })
            .catch((error) => {
              this.logger.error('Failed to fetch user contents', error.message);
              throw httpToRpc(
                new HttpException(
                  'Failed to fetch user contents',
                  HttpStatus.INTERNAL_SERVER_ERROR,
                ),
              );
            });

          const allContents: FullContentDto[] = [];

          for (const content of contents) {
            try {
              const files = await tx.file.findMany({
                where: {
                  content_id: content.content_id,
                  content_area_id: content.area_id,
                },
              });

              const thumbnail = files.find((file) => file.type === 'thumbnail');
              if (!thumbnail && content.post_type !== 'post') {
                this.logger.warn(
                  `Content ${content.content_id} missing thumbnail`,
                );
                continue;
              }

              const mappedFiles: FileDto[] = files
                .filter((file) => file.type !== 'thumbnail')
                .map((file) => ({
                  file_id: file.file_id,
                  filepath: file.filepath,
                  content_id: file.content_id,
                  content_area_id: file.content_area_id,
                  type: file.type,
                }));

              allContents.push({
                content_id: content.content_id,
                creator_id: content.creator_id,
                parent_id: content.parent_id ?? undefined,
                area_id: content.area_id,
                title: content.title,
                description: content.description,
                published_at: content.published_at,
                post_type: content.post_type,
                visibilityPrivate: content.visibilityPrivate,
                views: content.views,
                likes: content.likes,
                comments: content.comments,
                pins: content.pins,
                reports: content.reports,
                thumbnail: thumbnail
                  ? {
                      file_id: thumbnail.file_id,
                      filepath: thumbnail.filepath,
                      content_id: thumbnail.content_id,
                      content_area_id: thumbnail.content_area_id,
                      type: thumbnail.type,
                    }
                  : null,
                contents: mappedFiles,
              });
            } catch (error) {
              this.logger.error(
                `Failed to fetch files for content ${content.content_id}`,
                error.message,
              );
              throw httpToRpc(
                new HttpException(
                  `Failed to fetch files for content ${content.content_id}`,
                  HttpStatus.INTERNAL_SERVER_ERROR,
                ),
              );
            }
          }

          return allContents;
        })
        .catch((error) => {
          if (error.status) {
            throw error;
          }
          this.logger.error('Transaction failed', error.message);
          throw httpToRpc(
            new HttpException(
              'Failed to fetch user contents - transaction rolled back',
              HttpStatus.INTERNAL_SERVER_ERROR,
            ),
          );
        });

      return result;
    } catch (error) {
      if (error.status) {
        throw error;
      }
      this.logger.error('Failed to fetch user contents', error.message);
      throw httpToRpc(
        new HttpException(
          'Failed to fetch user contents',
          HttpStatus.INTERNAL_SERVER_ERROR,
        ),
      );
    }
  }

  async getByUserAllPublic(creator_id: number): Promise<FullContentDto[]> {
    try {
      const result = await this.prisma
        .$transaction(async (tx) => {
          const contents = await tx.content
            .findMany({
              where: {
                creator_id,
                published_at: { lte: new Date() },
                visibilityPrivate: false,
              },
              orderBy: { created_at: 'desc' },
            })
            .catch((error) => {
              this.logger.error('Failed to fetch user contents', error.message);
              throw httpToRpc(
                new HttpException(
                  'Failed to fetch user contents',
                  HttpStatus.INTERNAL_SERVER_ERROR,
                ),
              );
            });

          const allContents: FullContentDto[] = [];

          for (const content of contents) {
            try {
              const files = await tx.file.findMany({
                where: {
                  content_id: content.content_id,
                  content_area_id: content.area_id,
                },
              });

              const thumbnail = files.find((file) => file.type === 'thumbnail');
              if (!thumbnail) {
                this.logger.warn(
                  `Content ${content.content_id} missing thumbnail`,
                );
                continue;
              }

              const mappedFiles: FileDto[] = files
                .filter((file) => file.type !== 'thumbnail')
                .map((file) => ({
                  file_id: file.file_id,
                  filepath: file.filepath,
                  content_id: file.content_id,
                  content_area_id: file.content_area_id,
                  type: file.type,
                }));

              allContents.push({
                content_id: content.content_id,
                creator_id: content.creator_id,
                parent_id: content.parent_id ?? undefined,
                area_id: content.area_id,
                title: content.title,
                description: content.description,
                published_at: content.published_at,
                post_type: content.post_type,
                visibilityPrivate: content.visibilityPrivate,
                views: content.views,
                likes: content.likes,
                comments: content.comments,
                pins: content.pins,
                reports: content.reports,
                thumbnail: {
                  file_id: thumbnail.file_id,
                  filepath: thumbnail.filepath,
                  content_id: thumbnail.content_id,
                  content_area_id: thumbnail.content_area_id,
                  type: thumbnail.type,
                },
                contents: mappedFiles,
              });
            } catch (error) {
              this.logger.error(
                `Failed to fetch files for content ${content.content_id}`,
                error.message,
              );
              throw httpToRpc(
                new HttpException(
                  `Failed to fetch files for content ${content.content_id}`,
                  HttpStatus.INTERNAL_SERVER_ERROR,
                ),
              );
            }
          }

          return allContents;
        })
        .catch((error) => {
          if (error.status) {
            throw error;
          }
          this.logger.error('Transaction failed', error.message);
          throw httpToRpc(
            new HttpException(
              'Failed to fetch user contents - transaction rolled back',
              HttpStatus.INTERNAL_SERVER_ERROR,
            ),
          );
        });

      return result;
    } catch (error) {
      if (error.status) {
        throw error;
      }
      this.logger.error('Failed to fetch user contents', error.message);
      throw httpToRpc(
        new HttpException(
          'Failed to fetch user contents',
          HttpStatus.INTERNAL_SERVER_ERROR,
        ),
      );
    }
  }

  async remove(content_id: number, area_id: number): Promise<Ack> {
    if (area_id <= 0 || area_id > 3)
      throw httpToRpc(
        new HttpException('Invalid area ID', HttpStatus.BAD_REQUEST),
      );
    try {
      await this.prisma.content.delete({
        where: { content_id_area_id: { content_id, area_id } },
      });
      return { Valid: true, Msg: 'Content removed successfully' };
    } catch (error) {
      this.logger.error('Failed to delete content', error.message);
      throw httpToRpc(
        new HttpException(
          'Failed to delete content',
          HttpStatus.INTERNAL_SERVER_ERROR,
        ),
      );
    }
  }

  async updateView(
    content_id: number,
    area_id: number,
    dto: deltaDto,
  ): Promise<Ack> {
    if (area_id <= 0 || area_id > 3)
      throw httpToRpc(
        new HttpException('Invalid area ID', HttpStatus.BAD_REQUEST),
      );
    try {
      await this.prisma.content.update({
        where: {
          content_id_area_id: {
            content_id: content_id,
            area_id: area_id,
          },
        },
        data: { views: { increment: dto.delta } },
      });
      return { Valid: true, Msg: 'View count updated' };
    } catch (error) {
      this.logger.error('Failed to update view count', error);
      throw httpToRpc(
        new HttpException(
          'Failed to update view count',
          HttpStatus.INTERNAL_SERVER_ERROR,
        ),
      );
    }
  }

  async updateLike(
    content_id: number,
    area_id: number,
    dto: deltaDto,
  ): Promise<Ack> {
    if (area_id <= 0 || area_id > 3)
      throw httpToRpc(
        new HttpException('Invalid area ID', HttpStatus.BAD_REQUEST),
      );
    try {
      await this.prisma.content.update({
        where: {
          content_id_area_id: {
            content_id: content_id,
            area_id: area_id,
          },
        },
        data: { likes: { increment: dto.delta } },
      });
      return { Valid: true, Msg: 'Like count updated' };
    } catch (error) {
      this.logger.error('Failed to update like count', error);
      throw httpToRpc(
        new HttpException(
          'Failed to update like count',
          HttpStatus.BAD_REQUEST,
        ),
      );
    }
  }

  async updatePin(
    content_id: number,
    area_id: number,
    dto: deltaDto,
  ): Promise<Ack> {
    if (area_id <= 0 || area_id > 3)
      throw httpToRpc(
        new HttpException('Invalid area ID', HttpStatus.BAD_REQUEST),
      );
    try {
      await this.prisma.content.update({
        where: {
          content_id_area_id: {
            content_id: content_id,
            area_id: area_id,
          },
        },
        data: { pins: { increment: dto.delta } },
      });
      return { Valid: true, Msg: 'Pin count updated' };
    } catch (error) {
      this.logger.error('Failed to update pin count', error);
      throw httpToRpc(
        new HttpException('Failed to update pin count', HttpStatus.BAD_REQUEST),
      );
    }
  }

  async updateComment(
    content_id: number,
    area_id: number,
    dto: deltaDto,
  ): Promise<Ack> {
    if (area_id <= 0 || area_id > 3)
      throw httpToRpc(
        new HttpException('Invalid area ID', HttpStatus.BAD_REQUEST),
      );
    try {
      await this.prisma.content.update({
        where: {
          content_id_area_id: {
            content_id: content_id,
            area_id: area_id,
          },
        },
        data: { comments: { increment: dto.delta } },
      });
      return { Valid: true, Msg: 'Comment count updated' };
    } catch (error) {
      this.logger.error('Failed to update comment count', error);
      throw httpToRpc(
        new HttpException(
          'Failed to update comment count',
          HttpStatus.INTERNAL_SERVER_ERROR,
        ),
      );
    }
  }

  async updateReport(
    content_id: number,
    area_id: number,
    dto: deltaDto,
  ): Promise<Ack> {
    if (area_id <= 0 || area_id > 3)
      throw httpToRpc(
        new HttpException('Invalid area ID', HttpStatus.BAD_REQUEST),
      );
    try {
      await this.prisma.content.update({
        where: {
          content_id_area_id: {
            content_id: content_id,
            area_id: area_id,
          },
        },
        data: { reports: { increment: dto.delta } },
      });
      return { Valid: true, Msg: 'Report count updated' };
    } catch (error) {
      this.logger.error('Failed to update report count', error);
      throw httpToRpc(
        new HttpException(
          'Failed to update report count',
          HttpStatus.INTERNAL_SERVER_ERROR,
        ),
      );
    }
  }

  async setPrivate(content_id: number, area_id: number): Promise<Ack> {
    try {
      await this.prisma.content.update({
        where: { content_id_area_id: { content_id, area_id } },
        data: { visibilityPrivate: true },
      });
      return { Valid: true, Msg: 'Content set to private' };
    } catch (error) {
      this.logger.error('Failed to set content private', error.message);
      throw httpToRpc(
        new HttpException(
          'Failed to set content private',
          HttpStatus.INTERNAL_SERVER_ERROR,
        ),
      );
    }
  }

  async setPublic(content_id: number, area_id: number): Promise<Ack> {
    if (area_id <= 0 || area_id > 3)
      throw httpToRpc(
        new HttpException('Invalid area ID', HttpStatus.BAD_REQUEST),
      );
    try {
      await this.prisma.content.update({
        where: { content_id_area_id: { content_id, area_id } },
        data: { visibilityPrivate: false },
      });
      return { Valid: true, Msg: 'Content set to public' };
    } catch (error) {
      this.logger.error('Failed to set content public', error.message);
      throw httpToRpc(
        new HttpException(
          'Failed to set content public',
          HttpStatus.INTERNAL_SERVER_ERROR,
        ),
      );
    }
  }

  async getFile(contentId: number, areaId: number): Promise<FileDto> {
    if (areaId <= 0 || areaId > 3)
      throw httpToRpc(
        new HttpException('Invalid area ID', HttpStatus.BAD_REQUEST),
      );
    try {
      const file = await this.prisma.file.findFirst({
        where: {
          content_id: contentId,
          content_area_id: areaId,
        },
      });

      if (!file) {
        throw httpToRpc(
          new HttpException('File not found', HttpStatus.NOT_FOUND),
        );
      }

      return {
        file_id: file.file_id,
        filepath: file.filepath,
        content_id: file.content_id,
        content_area_id: file.content_area_id,
        type: file.type,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      this.logger.error('Failed to fetch file', error.message);
      throw httpToRpc(
        new HttpException(
          'Failed to fetch file',
          HttpStatus.INTERNAL_SERVER_ERROR,
        ),
      );
    }
  }

  async getFiles(contentId: number, areaId: number): Promise<FileDto[]> {
    if (areaId <= 0 || areaId > 3)
      throw httpToRpc(
        new HttpException('Invalid area ID', HttpStatus.BAD_REQUEST),
      );
    try {
      const files = await this.prisma.file.findMany({
        where: {
          content_id: contentId,
          content_area_id: areaId,
        },
      });

      return files.map((file) => ({
        file_id: file.file_id,
        filepath: file.filepath,
        content_id: file.content_id,
        content_area_id: file.content_area_id,
        type: file.type ?? undefined,
      }));
    } catch (error) {
      this.logger.error('Failed to fetch files', error.message);
      throw httpToRpc(
        new HttpException(
          'Failed to fetch files',
          HttpStatus.INTERNAL_SERVER_ERROR,
        ),
      );
    }
  }

  async getFollowingContent(userId: number): Promise<FullContentDto[]> {
    this.logger.log(`User ${userId} is following`);
    try {
      const result = await this.prisma
        .$transaction(async (tx) => {
          const followings = await firstValueFrom(
            this.connectionClient.send(CONNECTION_MSG.getFollowingByUser, {
              id: userId,
            }),
          ).catch((error) => {
            this.logger.error('Failed to fetch following list', error.message);
            throw httpToRpc(
              new HttpException(
                'Failed to fetch following list',
                HttpStatus.NOT_FOUND,
              ),
            );
          });

          this.logger.log(
            `User ${userId} is following ${followings.length} users`,
          );
          const followingIds = followings.map((f) => f.creator_id);
          this.logger.log(followingIds[0]);

          const contents = await tx.content
            .findMany({
              where: {
                creator_id: { in: followingIds },
                published_at: { lte: new Date() },
              },
              orderBy: { created_at: 'desc' },
            })
            .catch((error) => {
              this.logger.error(
                'Failed to fetch following contents',
                error.message,
              );
              throw httpToRpc(
                new HttpException(
                  'Failed to fetch following contents',
                  HttpStatus.INTERNAL_SERVER_ERROR,
                ),
              );
            });

          const allContents: FullContentDto[] = [];

          for (const content of contents) {
            try {
              const files = await tx.file.findMany({
                where: {
                  content_id: content.content_id,
                  content_area_id: content.area_id,
                },
              });

              const thumbnail = files.find((file) => file.type === 'thumbnail');
              if (!thumbnail) {
                this.logger.warn(
                  `Content ${content.content_id} missing thumbnail`,
                );
                continue;
              }

              const mappedFiles: FileDto[] = files
                .filter((file) => file.type !== 'thumbnail')
                .map((file) => ({
                  file_id: file.file_id,
                  filepath: file.filepath,
                  content_id: file.content_id,
                  content_area_id: file.content_area_id,
                  type: file.type,
                }));

              allContents.push({
                content_id: content.content_id,
                creator_id: content.creator_id,
                parent_id: content.parent_id ?? undefined,
                area_id: content.area_id,
                title: content.title,
                description: content.description,
                published_at: content.published_at,
                post_type: content.post_type,
                visibilityPrivate: content.visibilityPrivate,
                views: content.views,
                likes: content.likes,
                comments: content.comments,
                pins: content.pins,
                reports: content.reports,
                thumbnail: {
                  file_id: thumbnail.file_id,
                  filepath: thumbnail.filepath,
                  content_id: thumbnail.content_id,
                  content_area_id: thumbnail.content_area_id,
                  type: thumbnail.type,
                },
                contents: mappedFiles,
              });
            } catch (error) {
              this.logger.error(
                `Failed to fetch files for content ${content.content_id}`,
                error.message,
              );
              throw httpToRpc(
                new HttpException(
                  `Failed to fetch files for content ${content.content_id}`,
                  HttpStatus.INTERNAL_SERVER_ERROR,
                ),
              );
            }
          }

          return allContents;
        })
        .catch((error) => {
          if (error.status) {
            throw error;
          }
          this.logger.error('Transaction failed', error.message);
          throw httpToRpc(
            new HttpException(
              'Failed to fetch following contents - transaction rolled back',
              HttpStatus.INTERNAL_SERVER_ERROR,
            ),
          );
        });

      return result;
    } catch (error) {
      if (error.status) {
        throw error;
      }
      throw httpToRpc(
        new HttpException(
          'Failed to fetch following contents',
          HttpStatus.NOT_FOUND,
        ),
      );
    }
  }
  async getFriendContent(userId: number): Promise<FullContentDto[]> {
    try {
      const result = await this.prisma
        .$transaction(async (tx) => {
          const friends = await firstValueFrom(
            this.connectionClient.send(CONNECTION_MSG.getFriendsbyUser, {
              id: userId,
            }),
          ).catch((error) => {
            this.logger.error('Failed to fetch friend list', error.message);
            throw httpToRpc(
              new HttpException(
                'Failed to fetch friend list',
                HttpStatus.NOT_FOUND,
              ),
            );
          });

          const friendIds = friends.map((f) => f.friend_id);

          const contents = await tx.content
            .findMany({
              where: {
                creator_id: { in: friendIds },
                published_at: { lte: new Date() },
              },
              orderBy: { created_at: 'desc' },
            })
            .catch((error) => {
              this.logger.error(
                'Failed to fetch friend contents',
                error.message,
              );
              throw httpToRpc(
                new HttpException(
                  'Failed to fetch friend contents',
                  HttpStatus.INTERNAL_SERVER_ERROR,
                ),
              );
            });

          const allContents: FullContentDto[] = [];

          for (const content of contents) {
            try {
              const files = await tx.file.findMany({
                where: {
                  content_id: content.content_id,
                  content_area_id: content.area_id,
                },
              });

              const thumbnail = files.find((file) => file.type === 'thumbnail');
              if (!thumbnail) {
                this.logger.warn(
                  `Content ${content.content_id} missing thumbnail`,
                );
                continue;
              }

              const mappedFiles: FileDto[] = files
                .filter((file) => file.type !== 'thumbnail')
                .map((file) => ({
                  file_id: file.file_id,
                  filepath: file.filepath,
                  content_id: file.content_id,
                  content_area_id: file.content_area_id,
                  type: file.type,
                }));

              allContents.push({
                content_id: content.content_id,
                creator_id: content.creator_id,
                parent_id: content.parent_id ?? undefined,
                area_id: content.area_id,
                title: content.title,
                description: content.description,
                post_type: content.post_type,
                visibilityPrivate: content.visibilityPrivate,
                views: content.views,
                likes: content.likes,
                comments: content.comments,
                published_at: content.published_at,
                pins: content.pins,
                reports: content.reports,
                thumbnail: {
                  file_id: thumbnail.file_id,
                  filepath: thumbnail.filepath,
                  content_id: thumbnail.content_id,
                  content_area_id: thumbnail.content_area_id,
                  type: thumbnail.type,
                },
                contents: mappedFiles,
              });
            } catch (error) {
              this.logger.error(
                `Failed to fetch files for content ${content.content_id}`,
                error.message,
              );
              throw httpToRpc(
                new HttpException(
                  `Failed to fetch files for content ${content.content_id}`,
                  HttpStatus.INTERNAL_SERVER_ERROR,
                ),
              );
            }
          }

          return allContents;
        })
        .catch((error) => {
          if (error.status) {
            throw error;
          }
          this.logger.error('Transaction failed', error.message);
          throw httpToRpc(
            new HttpException(
              'Failed to fetch friend contents - transaction rolled back',
              HttpStatus.INTERNAL_SERVER_ERROR,
            ),
          );
        });

      return result;
    } catch (error) {
      if (error.status) {
        throw error;
      }
      throw httpToRpc(
        new HttpException(
          'Failed to fetch friend contents',
          HttpStatus.NOT_FOUND,
        ),
      );
    }
  }

  async getLikedByUser(userId: number): Promise<FullContentDto[]> {
    try {
      const result = await this.prisma
        .$transaction(async (tx) => {
          const histories = await firstValueFrom(
            this.historyClient.send(HISTORY_MSG.getByUser, userId),
          ).catch((error) => {
            this.logger.error('Failed to fetch history records', error.message);
            throw httpToRpc(
              new HttpException(
                'Failed to fetch history records',
                HttpStatus.NOT_FOUND,
              ),
            );
          });

          this.logger.log(
            `User ${userId} has ${histories.length} history records`,
          );

          const liked = histories.filter((h) => h.liked === true);
          const likedIds = liked.map((f) => f.content_id);

          const contents = await tx.content
            .findMany({
              where: {
                content_id: { in: likedIds },
                published_at: { lte: new Date() },
              },
              orderBy: { created_at: 'desc' },
            })
            .catch((error) => {
              this.logger.error(
                'Failed to fetch liked contents',
                error.message,
              );
              throw httpToRpc(
                new HttpException(
                  'Failed to fetch liked contents',
                  HttpStatus.INTERNAL_SERVER_ERROR,
                ),
              );
            });

          const allContents: FullContentDto[] = [];

          for (const content of contents) {
            try {
              const files = await tx.file.findMany({
                where: {
                  content_id: content.content_id,
                  content_area_id: content.area_id,
                },
              });

              const thumbnail = files.find((file) => file.type === 'thumbnail');
              if (!thumbnail) {
                this.logger.warn(
                  `Content ${content.content_id} missing thumbnail`,
                );
                continue;
              }

              const mappedFiles: FileDto[] = files
                .filter((file) => file.type !== 'thumbnail')
                .map((file) => ({
                  file_id: file.file_id,
                  filepath: file.filepath,
                  content_id: file.content_id,
                  content_area_id: file.content_area_id,
                  type: file.type,
                }));

              allContents.push({
                content_id: content.content_id,
                creator_id: content.creator_id,
                parent_id: content.parent_id ?? undefined,
                area_id: content.area_id,
                title: content.title,
                description: content.description,
                post_type: content.post_type,
                published_at: content.published_at,
                visibilityPrivate: content.visibilityPrivate,
                views: content.views,
                likes: content.likes,
                comments: content.comments,
                pins: content.pins,
                reports: content.reports,
                thumbnail: {
                  file_id: thumbnail.file_id,
                  filepath: thumbnail.filepath,
                  content_id: thumbnail.content_id,
                  content_area_id: thumbnail.content_area_id,
                  type: thumbnail.type,
                },
                contents: mappedFiles,
              });
            } catch (error) {
              this.logger.error(
                `Failed to fetch files for content ${content.content_id}`,
                error.message,
              );
              throw httpToRpc(
                new HttpException(
                  `Failed to fetch files for content ${content.content_id}`,
                  HttpStatus.INTERNAL_SERVER_ERROR,
                ),
              );
            }
          }

          return allContents;
        })
        .catch((error) => {
          if (error.status) {
            throw error;
          }
          this.logger.error('Transaction failed', error.message);
          throw httpToRpc(
            new HttpException(
              'Failed to fetch liked contents - transaction rolled back',
              HttpStatus.INTERNAL_SERVER_ERROR,
            ),
          );
        });

      return result;
    } catch (error) {
      if (error.status) {
        throw error;
      }
      this.logger.warn('No liked contents found or error occurred');
      return [];
    }
  }
  async getPinnedByUser(userId: number): Promise<FullContentDto[]> {
    try {
      const result = await this.prisma
        .$transaction(async (tx) => {
          const histories = await firstValueFrom(
            this.historyClient.send(HISTORY_MSG.getByUser, userId),
          ).catch((error) => {
            this.logger.error('Failed to fetch friend list', error.message);
            throw httpToRpc(
              new HttpException(
                'Failed to fetch friend list',
                HttpStatus.NOT_FOUND,
              ),
            );
          });

          const pinned = histories.filter((h) => h.pinned === true);
          const pinnedIds = pinned.map((f) => f.content_id);

          const contents = await tx.content
            .findMany({
              where: {
                content_id: { in: pinnedIds },
                published_at: { lte: new Date() },
              },
              orderBy: { created_at: 'desc' },
            })
            .catch((error) => {
              this.logger.error(
                'Failed to fetch pinned contents',
                error.message,
              );
              throw httpToRpc(
                new HttpException(
                  'Failed to fetch pinned contents',
                  HttpStatus.INTERNAL_SERVER_ERROR,
                ),
              );
            });

          const allContents: FullContentDto[] = [];

          for (const content of contents) {
            try {
              const files = await tx.file.findMany({
                where: {
                  content_id: content.content_id,
                  content_area_id: content.area_id,
                },
              });

              const thumbnail = files.find((file) => file.type === 'thumbnail');
              if (!thumbnail) {
                this.logger.warn(
                  `Content ${content.content_id} missing thumbnail`,
                );
                continue;
              }

              const mappedFiles: FileDto[] = files
                .filter((file) => file.type !== 'thumbnail')
                .map((file) => ({
                  file_id: file.file_id,
                  filepath: file.filepath,
                  content_id: file.content_id,
                  content_area_id: file.content_area_id,
                  type: file.type,
                }));

              allContents.push({
                content_id: content.content_id,
                creator_id: content.creator_id,
                parent_id: content.parent_id ?? undefined,
                area_id: content.area_id,
                title: content.title,
                description: content.description,
                published_at: content.published_at,
                post_type: content.post_type,
                visibilityPrivate: content.visibilityPrivate,
                views: content.views,
                likes: content.likes,
                comments: content.comments,
                pins: content.pins,
                reports: content.reports,
                thumbnail: {
                  file_id: thumbnail.file_id,
                  filepath: thumbnail.filepath,
                  content_id: thumbnail.content_id,
                  content_area_id: thumbnail.content_area_id,
                  type: thumbnail.type,
                },
                contents: mappedFiles,
              });
            } catch (error) {
              this.logger.error(
                `Failed to fetch files for content ${content.content_id}`,
                error.message,
              );
              throw httpToRpc(
                new HttpException(
                  `Failed to fetch files for content ${content.content_id}`,
                  HttpStatus.INTERNAL_SERVER_ERROR,
                ),
              );
            }
          }

          return allContents;
        })
        .catch((error) => {
          if (error.status) {
            throw error;
          }
          this.logger.error('Transaction failed', error.message);
          throw httpToRpc(
            new HttpException(
              'Failed to fetch pinned contents - transaction rolled back',
              HttpStatus.INTERNAL_SERVER_ERROR,
            ),
          );
        });

      return result;
    } catch (error) {
      if (error.status) {
        throw error;
      }
      this.logger.warn('No pinned contents found or error occurred');
      return [];
    }
  }

  async buildAncestorPostTree(
    posts: FullContentDto[],
    contentId: number,
  ): Promise<FullContentDto[]> {
    const map = new Map<number, FullContentDto>();
    posts.forEach((post) => map.set(post.content_id!, post));

    const chain: FullContentDto[] = [];
    let current = map.get(contentId);

    while (current) {
      chain.push(current);

      if (!current.parent_id || current.parent_id === 0) {
        break;
      }

      current = map.get(current.parent_id);

      if (!current) {
        break;
      }
    }

    return chain;
  }

  async getAncestorPost(
    contentId: number,
    areaId: number,
  ): Promise<FullContentDto[]> {
    if (areaId <= 0 || areaId > 3) {
      throw httpToRpc(
        new HttpException('Invalid area ID', HttpStatus.BAD_REQUEST),
      );
    }

    try {
      const content = await this.prisma.content.findUnique({
        where: {
          content_id_area_id: { content_id: contentId, area_id: areaId },
        },
      });

      if (!content) {
        throw httpToRpc(
          new HttpException('Content not found', HttpStatus.NOT_FOUND),
        );
      }

      if (!content.parent_id || content.parent_id === 0) {
        return [];
      }

      const ancestors: any[] = [];
      let current = content;

      while (current && current.parent_id && current.parent_id !== 0) {
        const parent = await this.prisma.content.findUnique({
          where: {
            content_id_area_id: {
              content_id: current.parent_id,
              area_id: areaId,
            },
          },
        });

        if (!parent) {
          break;
        }

        ancestors.push(parent);
        current = parent;
      }

      const result: FullContentDto[] = [];
      for (const ancestor of ancestors) {
        const fullContent = await this.findOne(ancestor.content_id, areaId);
        result.push(fullContent);
      }

      return result;
    } catch (error) {
      if (error.status) {
        throw error;
      }
      this.logger.error('Failed to fetch ancestor posts', error.message);
      throw httpToRpc(
        new HttpException(
          'Failed to fetch ancestor posts',
          HttpStatus.INTERNAL_SERVER_ERROR,
        ),
      );
    }
  }

  async getFullPost(
    contentId: number,
    areaId: number,
  ): Promise<FullContentDto> {
    return await this.findOne(contentId, areaId);
  }

  async getChildPost(parent_id: number): Promise<FullContentDto[]> {
    try {
      const result = await this.prisma
        .$transaction(async (tx) => {
          const contents = await tx.content
            .findMany({
              where: {
                post_type: 'post',
                parent_id: parent_id,
                published_at: { lte: new Date() },
                visibilityPrivate: false,
              },
              orderBy: { created_at: 'desc' },
            })
            .catch((error) => {
              this.logger.error('Failed to fetch child posts', error.message);
              throw httpToRpc(
                new HttpException(
                  'Failed to fetch child posts',
                  HttpStatus.INTERNAL_SERVER_ERROR,
                ),
              );
            });

          const allContents: FullContentDto[] = [];

          for (const content of contents) {
            try {
              const files = await tx.file.findMany({
                where: {
                  content_id: content.content_id,
                  content_area_id: content.area_id,
                },
              });

              const thumbnail = files.find((file) => file.type === 'thumbnail');
              if (!thumbnail) {
                this.logger.warn(
                  `Content ${content.content_id} missing thumbnail`,
                );
                continue;
              }

              const mappedFiles: FileDto[] = files
                .filter((file) => file.type !== 'thumbnail')
                .map((file) => ({
                  file_id: file.file_id,
                  filepath: file.filepath,
                  content_id: file.content_id,
                  content_area_id: file.content_area_id,
                  type: file.type,
                }));

              allContents.push({
                content_id: content.content_id,
                creator_id: content.creator_id,
                parent_id: content.parent_id ?? undefined,
                area_id: content.area_id,
                title: content.title,
                description: content.description,
                post_type: content.post_type,
                published_at: content.published_at,
                visibilityPrivate: content.visibilityPrivate,
                views: content.views,
                likes: content.likes,
                comments: content.comments,
                pins: content.pins,
                reports: content.reports,
                thumbnail: {
                  file_id: thumbnail.file_id,
                  filepath: thumbnail.filepath,
                  content_id: thumbnail.content_id,
                  content_area_id: thumbnail.content_area_id,
                  type: thumbnail.type,
                },
                contents: mappedFiles,
              });
            } catch (error) {
              this.logger.error(
                `Failed to fetch files for content ${content.content_id}`,
                error.message,
              );
              throw httpToRpc(
                new HttpException(
                  `Failed to fetch files for content ${content.content_id}`,
                  HttpStatus.INTERNAL_SERVER_ERROR,
                ),
              );
            }
          }

          return allContents.filter((content) => content.parent_id !== null);
        })
        .catch((error) => {
          if (error.status) {
            throw error;
          }
          this.logger.error('Transaction failed', error.message);
          throw httpToRpc(
            new HttpException(
              'Failed to fetch child posts - transaction rolled back',
              HttpStatus.INTERNAL_SERVER_ERROR,
            ),
          );
        });

      return result;
    } catch (error) {
      if (error.status) {
        throw error;
      }
      this.logger.error('Failed to fetch child posts', error.message);
      throw httpToRpc(
        new HttpException(
          'Failed to fetch child posts',
          HttpStatus.INTERNAL_SERVER_ERROR,
        ),
      );
    }
  }
}
