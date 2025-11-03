import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from '@app/contracts/shared-dto/user/create-user.dto';
import {
  UpdateProfileUserDto,
  UpdateRestriction,
} from '@app/contracts/shared-dto/user/update-user.dto';
import { Repository } from './repository/repository';
import { IUserService } from '@app/common/interfaces/user/IUserService';
import { Ack } from '@app/contracts/shared-dto/ack.dto';
import { mapToDto } from './utils/mapToDto';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class UserService implements IUserService {
  constructor(private readonly repo: Repository) {}

  async create(createUserDto: CreateUserDto) {
    return this.repo.createUser(createUserDto);
  }

  async findAll() {
    return this.repo.findAll();
  }

  async findOne(id: number) {
    const user = await this.repo.findOne(id);
    if (!user) throw new NotFoundException(`User with ID ${id} not found`);
    return mapToDto(user);
  }

  async updateProfile(id: number, updateProfileUserDto: UpdateProfileUserDto) {
    return this.repo.updateProfile(id, updateProfileUserDto);
  }

  async updateRestriction(
    id: number,
    updateRestriction: UpdateRestriction,
  ): Promise<Ack> {
    return this.repo.updateRestriction(id, updateRestriction);
  }

  async updateLike(id: number, delta: number): Promise<Ack> {
    return {
      Msg: 'Still Developing',
      Valid: false,
    };
  }
  async updateFollow(id: number): Promise<Ack> {
    return {
      Msg: 'Still Developing',
      Valid: false,
    };
  }
  async updateReport(id: number): Promise<Ack> {
    return {
      Msg: 'Still Developing',
      Valid: false,
    };
  }

  async remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
