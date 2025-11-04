import { Controller, UseFilters } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UserService } from './user.service';
import { CreateUserDto } from '@app/contracts/shared-dto/user/create-user.dto';
import {
  UpdateProfileUserDto,
  UpdateRestriction,
} from '@app/contracts/shared-dto/user/update-user.dto';
import { USER_MSG } from '@app/common/constants/messageEvent';
import { NameRequest } from '@app/contracts/shared-dto/user/find.name.dto';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @MessagePattern(USER_MSG.create)
  async create(@Payload() createUserDto: CreateUserDto) {
    return await this.userService.create(createUserDto);
  }

  @MessagePattern(USER_MSG.findAll)
  async findAll() {
    return this.userService.findAll();
  }

  @MessagePattern(USER_MSG.findOne)
  async findOne(@Payload() id: number) {
    return this.userService.findOne(id);
  }

  @MessagePattern(USER_MSG.updateProfile)
  async updateProfile(
    @Payload() data: { id: number; dto: UpdateProfileUserDto },
  ) {
    return this.userService.updateProfile(data.id, data.dto);
  }
  @MessagePattern(USER_MSG.updateLike)
  async updateLike(@Payload() data: { id: number; delta: number }) {
    return this.userService.updateLike(data.id, data.delta);
  }

  @MessagePattern(USER_MSG.updateFollow)
  async updateFollow(@Payload() data: { id: number; delta: number }) {
    return this.userService.updateFollow(data.id, data.delta);
  }

  @MessagePattern(USER_MSG.updateReport)
  async updateReport(@Payload() data: { id: number; delta: number }) {
    return this.userService.updateReport(data.id, data.delta);
  }

  @MessagePattern(USER_MSG.updateRestriction)
  async updateRestriction(
    @Payload() data: { id: number; dto: UpdateRestriction },
  ) {
    return this.userService.updateRestriction(data.id, data.dto);
  }

  @MessagePattern(USER_MSG.remove)
  async remove(@Payload() id: number) {
    return this.userService.remove(id);
  }

  @MessagePattern(USER_MSG.findByName)
  async findByName(@Payload() dto: NameRequest) {
    return this.userService.findByName(dto);
  }
}
