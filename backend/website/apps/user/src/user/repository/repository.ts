import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { UserDatabaseConnection } from '@app/common/database/user-database-connection/user-database-connection';
import { CreateUserDto } from '@app/contracts/shared-dto/user/create-user.dto';
import {
  UpdateProfileUserDto,
  UpdateRestriction,
} from '@app/contracts/shared-dto/user/update-user.dto';
import { UserDto } from '@app/contracts/shared-dto/user/user.dto';
import { mapToDto } from '../utils/mapToDto';
import { Ack } from '@app/contracts/shared-dto/ack.dto';

@Injectable()
export class Repository {
  constructor(private readonly prisma: UserDatabaseConnection) {}

  async createUser(newUser: CreateUserDto) {
    try {
      const user = await this.prisma.user.create({
        data: {
          username: newUser.username,
          password: newUser.password,
          desc: '你好很高興見到你',
          follower: 0,
          profile_picture: '',
          total_like: 0,
          total_reports: 0,
          liked_visibilityPrivate: false,
          pinned_visibilityPrivate: false,
          content_visibilityPrivate: false,
        },
      });
      return 'Success Creating User ' + user.username;
    } catch (error) {
      console.error('Error creating user:', error);
      throw new InternalServerErrorException({
        statusCode: 500,
        message: 'Failed to create user',
        error: error.message,
      });
    }
  }
  async findAll(): Promise<UserDto[]> {
    try {
      const users = await this.prisma.user.findMany({
        orderBy: { user_id: 'asc' },
      });
      return users.map(mapToDto);
    } catch (error) {
      console.error('Error fetching users:', error);
      throw new InternalServerErrorException('Failed to fetch all users');
    }
  }

  async findOne(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { user_id: id },
    });
    return user;
  }

  async updateProfile(
    id: number,
    update: UpdateProfileUserDto,
  ): Promise<UserDto> {
    try {
      const updatedUser = await this.prisma.user.update({
        where: { user_id: id },
        data: {
          desc: update.desc,
          profile_picture: update.profile_picture,
        },
      });

      return mapToDto(updatedUser);
    } catch (error) {
      console.error(`Error updating user ${id}:`, error);
      throw new InternalServerErrorException('Failed to update user');
    }
  }

  async remove(id: number): Promise<boolean> {
    try {
      await this.prisma.user.delete({ where: { user_id: id } });
      return true;
    } catch (error) {
      console.error(`Error deleting user ${id}:`, error);
      throw new InternalServerErrorException('Failed to delete user');
    }
  }

  async updateRestriction(
    id: number,
    restriction: UpdateRestriction,
  ): Promise<Ack> {
    try {
      await this.prisma.user.update({
        where: {
          user_id: id,
        },
        data: {
          content_visibilityPrivate: restriction.content_visibilityPrivate,
          liked_visibilityPrivate: restriction.liked_visibilityPrivate,
          pinned_visibilityPrivate: restriction.pinned_visibilityPrivate,
        },
      });

      return {
        Msg: 'Success update restriction',
        Valid: true,
      };
    } catch (error) {
      console.error(`Error updating restrictions for user ${id}:`, error);

      throw new InternalServerErrorException('Failed to update restriction');
    }
  }

  async updateLike(id: number, total_like: number) {
    try {
      await this.prisma.user.update({
        where: {
          user_id: id,
        },
        data: {
          total_like: total_like,
        },
      });

      return true;
    } catch (error) {
      console.error(`Error updating restrictions for user ${id}:`, error);

      throw new InternalServerErrorException('Failed to update restriction');
    }
  }
}
