import { Injectable } from '@nestjs/common';
import { CreateUserDto } from '@app/contracts/shared-dto/user/create-user.dto';
import {
  UpdateProfileUserDto,
  UpdateRestriction,
} from '@app/contracts/shared-dto/user/update-user.dto';
import { Repository } from './repository/repository';
import { IUserService } from '@app/common/interfaces/user/IUserService';
import { Ack } from '@app/contracts/shared-dto/ack.dto';

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
    return this.repo.findOne(id);
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
    try {
      const user = this.repo
    } catch (error) {
      
    }



  }
  async updateFollow(id: number): Promise<Ack> {}
  async updateReport(id: number): Promise<Ack> {}

  async remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
