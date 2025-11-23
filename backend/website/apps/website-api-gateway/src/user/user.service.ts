import { Inject, Injectable, Logger } from '@nestjs/common';
import { CreateUserDto } from '@app/contracts/shared-dto/user/create-user.dto';
import {
  UpdateProfileUserDto,
  UpdateRestriction,
} from '@app/contracts/shared-dto/user/update-user.dto';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { USER_SERVICES } from '@app/common/constants/services';
import { IUserService } from '@app/contracts/interfaces/user/IUserService';
import { firstValueFrom, lastValueFrom } from 'rxjs';
import { USER_MSG } from '@app/common/constants/messageEvent';
import { Ack } from '@app/contracts/shared-dto/ack.dto';
import { NameRequest } from '@app/contracts/shared-dto/user/find.name.dto';
import { CredentialRes } from '@app/contracts/shared-dto/user/Creds.dto';
import { UserDto } from '@app/contracts/shared-dto/user/user.dto';

@Injectable()
export class UserService implements IUserService {
  private readonly logger = new Logger(UserService.name);
  constructor(@Inject(USER_SERVICES.CLIENT) private userClient: ClientProxy) {}
  async create(createUserDto: CreateUserDto): Promise<Ack> {
    return await firstValueFrom(
      this.userClient.send(USER_MSG.create, createUserDto),
    );
  }

  async findAll(area_id: number): Promise<UserDto[]> {
    return await firstValueFrom(
      this.userClient.send(USER_MSG.findAll, area_id),
    );
  }

  async findOne(id: number): Promise<UserDto> {
    return await firstValueFrom(this.userClient.send(USER_MSG.findOne, id));
  }

  async updateProfile(
    id: number,
    updateProfileUserDto: UpdateProfileUserDto,
  ): Promise<UserDto> {
    return firstValueFrom(
      this.userClient.send(USER_MSG.updateProfile, {
        id: id,
        dto: updateProfileUserDto,
      }),
    );
  }

  async remove(id: number): Promise<Ack> {
    return firstValueFrom(this.userClient.send(USER_MSG.remove, id));
  }
  async updateLike(id: number, delta: number): Promise<Ack> {
    return firstValueFrom(
      this.userClient.send(USER_MSG.updateLike, { id, delta }),
    );
  }

  async updateFollow(id: number, delta: number): Promise<Ack> {
    return firstValueFrom(
      this.userClient.send(USER_MSG.updateFollow, { id, delta }),
    );
  }

  async updateReport(id: number, delta: number): Promise<Ack> {
    return firstValueFrom(
      this.userClient.send(USER_MSG.updateReport, { id, delta }),
    );
  }

  async updateRestriction(
    id: number,
    updateRestriction: UpdateRestriction,
  ): Promise<Ack> {
    return firstValueFrom(
      this.userClient.send(USER_MSG.updateRestriction, {
        id,
        dto: updateRestriction,
      }),
    );
  }
  async findByName(dto: NameRequest): Promise<CredentialRes> {
    return firstValueFrom(this.userClient.send(USER_MSG.findByName, dto));
  }
}
