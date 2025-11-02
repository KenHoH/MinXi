import { CreateUserDto } from '@app/contracts/shared-dto/user/create-user.dto';
import { UpdateProfileUserDto } from '@app/contracts/shared-dto/user/update-user.dto';
import { UserDto } from '@app/contracts/shared-dto/user/user.dto';

export interface IUserService {
  create(createUserDto: CreateUserDto): Promise<String>;
  findAll(): Promise<UserDto[]>;
  findOne(id: number): Promise<UserDto>;
  updateProfile(
    id: number,
    updateProfileUserDto: UpdateProfileUserDto,
  ): Promise<String>;
  remove(id: number): Promise<String>;
}
