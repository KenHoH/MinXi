import { Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from '@app/contracts/shared-dto/user/create-user.dto';
import { UpdateProfileUserDto } from '@app/contracts/shared-dto/user/update-user.dto';
import { ClientProxy } from '@nestjs/microservices';
import { USER_SERVICES } from '@app/common/constants/services';
import { IUserService } from '@app/common/interfaces/user/IUserService';
import { firstValueFrom, lastValueFrom } from 'rxjs';
import { USER_MSG } from '@app/common/constants/messageEvent';

@Injectable()
export class UserService implements IUserService {
  constructor(@Inject(USER_SERVICES.CLIENT) private userClient: ClientProxy) {}
  async create(createUserDto: CreateUserDto) {
    return await firstValueFrom(
      this.userClient.send(USER_MSG.create, createUserDto),
    );
  }

  async findAll() {
    return await firstValueFrom(this.userClient.send(USER_MSG.findAll, {}));
  }

  async findOne(id: number) {
    return firstValueFrom(this.userClient.send(USER_MSG.findOne, id));
  }

  async updateProfile(id: number, updateProfileUserDto: UpdateProfileUserDto) {
    return firstValueFrom(
      this.userClient.send(USER_MSG.updateProfile, {
        id: id,
        updateProfileUserDto: updateProfileUserDto,
      }),
    );
  }

  async remove(id: number) {
    return firstValueFrom(this.userClient.send(USER_MSG.remove, id));
  }
}
