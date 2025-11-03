import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from '@app/contracts/shared-dto/user/create-user.dto';
import {
  UpdateProfileUserDto,
  UpdateRestriction,
} from '@app/contracts/shared-dto/user/update-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

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

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateProfileUserDto,
  ) {
    return this.userService.updateProfile(+id, updateUserDto);
  }
  @Patch('/updateRestriction/:id')
  updateRestriction(
    @Param('id', ParseIntPipe) id: number,
    @Body() update: UpdateRestriction,
  ) {
    return this.userService.updateRestriction(+id, update);
  }

  @Patch('/updateLike/:id')
  updateLike(@Param('id', ParseIntPipe) id: number, @Body() delta: number) {
    return this.userService.updateLike(+id, delta);
  }

  @Patch('/updateFollow/:id')
  updateFollow(@Param('id', ParseIntPipe) id: number, @Body() delta: number) {
    return this.userService.updateFollow(+id, delta);
  }

  @Patch('/updateReport/:id')
  updateReport(@Param('id', ParseIntPipe) id: number, @Body() delta: number) {
    return this.userService.updateReport(+id, delta);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.userService.remove(+id);
  }
}
