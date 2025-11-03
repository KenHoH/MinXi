import { Controller, UseFilters } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UserService } from './user.service';
import { CreateUserDto } from '@app/contracts/shared-dto/user/create-user.dto';
import { UpdateProfileUserDto } from '@app/contracts/shared-dto/user/update-user.dto';
import { HttpToRpcFilter } from '@app/common/filters/http-to-rpc/http-to-rpc.filter';

@UseFilters(HttpToRpcFilter)
@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @MessagePattern('user.createUser')
  async create(@Payload() createUserDto: CreateUserDto) {
    return await this.userService.create(createUserDto);
  }

  @MessagePattern('user.findAllUser')
  async findAll() {
    return this.userService.findAll();
  }

  @MessagePattern('user.findOneUser')
  async findOne(@Payload() id: number) {
    return this.userService.findOne(id);
  }

  @MessagePattern('user.updateProfile')
  async update(
    @Payload() id: number,
    updateProfileUserDto: UpdateProfileUserDto,
  ) {
    return this.userService.updateProfile(id, updateProfileUserDto);
  }

  @MessagePattern('user.removeUser')
  async remove(@Payload() id: number) {
    return this.userService.remove(id);
  }
}
