import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UseFilters,
  UseGuards,
  UseInterceptors,
  Res,
  UploadedFiles,
  BadRequestException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from '@app/contracts/shared-dto/user/create-user.dto';
import {
  UpdateProfileUserDto,
  UpdateRestriction,
} from '@app/contracts/shared-dto/user/update-user.dto';
import { RpcTranslateFilter } from '@app/common/filters/rpc-translate/rpc-translate.filter';
import { deltaDto } from '@app/contracts/shared-dto/user/delta.dto';
import { Payload } from '@nestjs/microservices';
import { NameRequest } from '@app/contracts/shared-dto/user/find.name.dto';
import { JwtAuthGuard } from '@app/common/guard/jwt-auth-guard/jwt-auth.guard';
import { AdminGuard } from '@app/common/guard/admin/admin.guard';
import { LogInterceptor } from '@app/common/interceptor/log/log.interceptor';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiResponse,
} from '@nestjs/swagger';
import { Public } from '@app/common/decorators/public.decorator';
import type { Response } from 'express';
import { Ack } from '@app/contracts/shared-dto/ack.dto';
import { UserDto } from '@app/contracts/shared-dto/user/user.dto';
import { CredentialRes } from '@app/contracts/shared-dto/user/Creds.dto';
import { createProfileSchema } from './schemas/create-profile.schema';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { MulterConfiguration } from '@app/common/config/multer.config';

@Controller('user')
@UseFilters(RpcTranslateFilter)
@UseGuards(JwtAuthGuard)
@UseInterceptors(LogInterceptor)
@ApiBearerAuth()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @Public()
  create(@Body() createUserDto: CreateUserDto): Promise<Ack> {
    return this.userService.create(createUserDto);
  }

  @Get('/area/:area')
  @Public()
  findAll(@Param('area', ParseIntPipe) area: number): Promise<UserDto[]> {
    return this.userService.findAll(+area);
  }

  @Get('/user/:id')
  @Public()
  findOne(@Param('id', ParseIntPipe) id: number): Promise<UserDto> {
    return this.userService.findOne(+id);
  }

  @Get('/user/full/:id')
  @Public()
  findOneById(@Param('id', ParseIntPipe) id: number): Promise<UserDto> {
    return this.userService.findOneById(+id);
  }

  @Patch(':id/profile')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Update profile',
    required: true,
    schema: createProfileSchema,
  })
  @ApiResponse({
    status: 201,
    description: 'Profile updated successfully',
    type: UserDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - missing required files or fields',
  })
  @UseInterceptors(
    FileFieldsInterceptor(
      [{ name: 'profile', maxCount: 1 }],
      MulterConfiguration,
    ),
  )
  update(
    @UploadedFiles()
    files: {
      profile?: Express.Multer.File[];
    },
    @Body() body: any,
  ): Promise<UserDto> {
    const creator_id = parseInt(body.creator_id, 10);
    const profileFile = files.profile ? files.profile[0] : null;

    if (isNaN(creator_id)) {
      throw new BadRequestException(
        'creator_id and area_id must be valid numbers',
      );
    }

    if (!profileFile) {
      throw new BadRequestException('Profile file is required');
    }
    const profilePath = `/api/uploads/profile/${profileFile.filename}`;

    const dto: UpdateProfileUserDto = {
      desc: body.description,
      profile_picture: profilePath,
    };

    return this.userService.updateProfile(+creator_id, dto);
  }

  @Patch(':id/like')
  updateLike(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: deltaDto,
  ): Promise<Ack> {
    return this.userService.updateLike(id, body.delta);
  }

  @Patch(':id/follow')
  updateFollow(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: deltaDto,
  ): Promise<Ack> {
    return this.userService.updateFollow(id, body.delta);
  }

  @Patch(':id/report')
  updateReport(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: deltaDto,
  ): Promise<Ack> {
    return this.userService.updateReport(id, body.delta);
  }

  @Patch(':id/restriction')
  updateRestriction(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateRestriction,
  ): Promise<Ack> {
    return this.userService.updateRestriction(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number): Promise<Ack> {
    return this.userService.remove(+id);
  }

  @Post('/name')
  @Public()
  findByName(
    @Payload() body: NameRequest,
    @Res({ passthrough: true }) response: Response,
  ): Promise<CredentialRes> {
    const userData = this.userService.findByName(body);

    return userData;
  }
  @Post('/one/name')
  @Public()
  findOneByName(@Body() body: NameRequest): Promise<UserDto> {
    return this.userService.findOneByName(body);
  }
}
