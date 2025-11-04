import { Ack } from '@app/contracts/shared-dto/ack.dto';
import { CreateUserDto } from '@app/contracts/shared-dto/user/create-user.dto';
import { CredentialRes } from '@app/contracts/shared-dto/user/Creds.dto';
import { NameRequest } from '@app/contracts/shared-dto/user/find.name.dto';
import {
  UpdateProfileUserDto,
  UpdateRestriction,
} from '@app/contracts/shared-dto/user/update-user.dto';
import { UserDto } from '@app/contracts/shared-dto/user/user.dto';

export interface IUserService {
  create(createUserDto: CreateUserDto): Promise<Ack>;
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
  updateReport(id: number, delta: number): Promise<Ack>;
  updateFollow(id: number, delta: number): Promise<Ack>;
  remove(id: number): Promise<Ack>;
  findByName(dto: NameRequest): Promise<CredentialRes>;
}
