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
import { ApiBearerAuth } from '@nestjs/swagger';
import { Public } from '@app/common/decorators/public.decorator';
import type { Response } from 'express';
import { Ack } from '@app/contracts/shared-dto/ack.dto';
import { UserDto } from '@app/contracts/shared-dto/user/user.dto';
import { CredentialRes } from '@app/contracts/shared-dto/user/Creds.dto';

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

  @Patch(':id/profile')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateProfileUserDto,
  ): Promise<UserDto> {
    return this.userService.updateProfile(+id, body);
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

    userData.then((user) => {
      response.cookie('user', JSON.stringify(user), {
        httpOnly: false,
        secure: true,
        sameSite: 'none',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });
    });

    return userData;
  }
}
