import { Controller, UseFilters } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UserService } from './user.service';
import { CreateUserDto } from '@app/contracts/shared-dto/user/create-user.dto';
import {
  UpdateProfileUserDto,
  UpdateRestriction,
} from '@app/contracts/shared-dto/user/update-user.dto';
import { HttpToRpcFilter } from '@app/common/filters/http-to-rpc/http-to-rpc.filter';
import { USER_MSG } from '@app/common/constants/messageEvent';

@UseFilters(HttpToRpcFilter)
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
  async update(
    @Payload() id: number,
    updateProfileUserDto: UpdateProfileUserDto,
  ) {
    return this.userService.updateProfile(id, updateProfileUserDto);
  }

  @MessagePattern(USER_MSG.updateRestriction)
  async updateRestriction(@Payload() id: number, dto: UpdateRestriction) {
    return this.userService.updateRestriction(id, dto);
  }

  @MessagePattern(USER_MSG.updateLike)
  async updateLike(@Payload() id: number, delta: number) {
    return this.userService.updateLike(id, delta);
  }
  @MessagePattern(USER_MSG.updateReport)
  async updateReport(@Payload() id: number, delta: number) {
    return this.userService.updateReport(id, delta);
  }
  @MessagePattern(USER_MSG.updateFollow)
  async updateFollow(@Payload() id: number, delta: number) {
    return this.userService.updateFollow(id, delta);
  }

  @MessagePattern(USER_MSG.remove)
  async remove(@Payload() id: number) {
    return this.userService.remove(id);
  }
}
