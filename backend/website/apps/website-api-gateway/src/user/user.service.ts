import { HttpException, Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from '@app/contracts/shared-dto/user/create-user.dto';
import {
  UpdateProfileUserDto,
  UpdateRestriction,
} from '@app/contracts/shared-dto/user/update-user.dto';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { USER_SERVICES } from '@app/common/constants/services';
import { IUserService } from '@app/common/interfaces/user/IUserService';
import { firstValueFrom, lastValueFrom } from 'rxjs';
import { USER_MSG } from '@app/common/constants/messageEvent';
import { Ack } from '@app/contracts/shared-dto/ack.dto';

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
    try {
      return await firstValueFrom(this.userClient.send(USER_MSG.findOne, id));
    } catch (err) {
      throw new RpcException(err?.error || err);
    }
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
  async updateFollow(id: number, delta: number): Promise<Ack> {
    return firstValueFrom(this.userClient.send(USER_MSG.updateFollow, id));
  }
  async updateLike(id: number, delta: number): Promise<Ack> {
    return firstValueFrom(this.userClient.send(USER_MSG.updateLike, id));
  }
  async updateReport(id: number, delta: number): Promise<Ack> {
    return firstValueFrom(this.userClient.send(USER_MSG.updateReport, id));
  }
  async updateRestriction(
    id: number,
    updateRestriction: UpdateRestriction,
  ): Promise<Ack> {
    return firstValueFrom(this.userClient.send(USER_MSG.updateRestriction, id));
  }
}
