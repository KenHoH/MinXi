import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UploadedFile,
  UseInterceptors,
  ParseFilePipeBuilder,
  HttpStatus,
} from '@nestjs/common';
import { ContentService } from './content.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';
import { MulterConfiguration } from '@app/common/config/multer.config';
const fileUploadSchema = {
  type: 'object',
  properties: {
    file: {
      type: 'string',
      format: 'binary',
      description: 'The file to upload (Image or Video)',
    },
  },
};
@Controller('content')
export class ContentController {
  constructor(private readonly contentService: ContentService) {}

  @Post('file')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'A file upload request',
    schema: fileUploadSchema,
  })
  @UseInterceptors(FileInterceptor('file', MulterConfiguration))
  uploadFile(
    @UploadedFile()
    file: Express.Multer.File,
  ) {
    const publicUrlPath = `/uploads/${file.filename}`;

    return {
      imageUrl: publicUrlPath,
    };
  }
}
