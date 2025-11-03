import { Ack } from '@app/contracts/shared-dto/ack.dto';
import { CreateUserDto } from '@app/contracts/shared-dto/user/create-user.dto';
import {
  UpdateProfileUserDto,
  UpdateRestriction,
} from '@app/contracts/shared-dto/user/update-user.dto';
import { UserDto } from '@app/contracts/shared-dto/user/user.dto';

export interface IUserService {
  create(createUserDto: CreateUserDto): Promise<String>;
  findAll(): Promise<UserDto[]>;
  findOne(id: number): Promise<UserDto>;
  updateProfile(
    id: number,
    updateProfileUserDto: UpdateProfileUserDto,
  ): Promise<UserDto>;
  updateRestriction(
    id: number,
    updateRestriction: UpdateRestriction,
  ): Promise<Ack>;
  updateLike(id: number, delta: number): Promise<Ack>;
  updateReport(id: number): Promise<Ack>;
  updateFollow(id: number): Promise<Ack>;
  remove(id: number): Promise<String>;
}
