import { Injectable } from '@nestjs/common';
import { CreateUserDto } from '@app/contracts/shared-dto/user/create-user.dto';
import { UpdateProfileUserDto } from '@app/contracts/shared-dto/user/update-user.dto';
import { Repository } from './repository/repository';
import { IUserService } from '@app/common/interfaces/user/IUserService';

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
    return `This action updates a #${id} user`;
  }

  async remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
