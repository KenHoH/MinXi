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
import { JwtAuthGuard } from '@app/common/auth/jwt-auth-guard/jwt-auth.guard';
import { AdminGuard } from '@app/common/auth/admin/admin.guard';

@Controller('user')
@UseFilters(RpcTranslateFilter)
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(AdminGuard)
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.userService.findOne(+id);
  }

  @Patch(':id/profile')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateProfileUserDto,
  ) {
    return this.userService.updateProfile(+id, body);
  }

  @Patch(':id/like')
  updateLike(@Param('id', ParseIntPipe) id: number, @Body() body: deltaDto) {
    return this.userService.updateLike(id, body.delta);
  }

  @Patch(':id/follow')
  updateFollow(@Param('id', ParseIntPipe) id: number, @Body() body: deltaDto) {
    return this.userService.updateFollow(id, body.delta);
  }

  @Patch(':id/report')
  updateReport(@Param('id', ParseIntPipe) id: number, @Body() body: deltaDto) {
    return this.userService.updateReport(id, body.delta);
  }

  @Patch(':id/restriction')
  updateRestriction(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateRestriction,
  ) {
    return this.userService.updateRestriction(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.userService.remove(+id);
  }

  @Post('/name')
  findByName(@Payload() body: NameRequest) {
    return this.userService.findByName(body);
  }
}
