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
    await this.prisma.user.create({
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
  }
  async findAll() {
    return await this.prisma.user.findMany({
      orderBy: { user_id: 'asc' },
    });
  }

  async findOne(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { user_id: id },
    });
    return user;
  }

  async updateProfile(id: number, update: UpdateProfileUserDto) {
    return this.prisma.user.update({
      where: { user_id: id },
      data: {
        desc: 'Testing',
        profile_picture: update.profile_picture,
      },
    });
  }

  async remove(id: number) {
    return this.prisma.user.delete({
      where: { user_id: id },
      select: {
        user_id: true,
        username: true,
      },
    });
  }

  async updateRestriction(id: number, restriction: UpdateRestriction) {
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
  }

  async updateLike(id: number, total_like: number) {
    return await this.prisma.user.update({
      where: {
        user_id: id,
      },
      data: {
        total_like: total_like,
      },
    });
  }

  async updateFollow(id: number, total_follow: number) {
    return await this.prisma.user.update({
      where: {
        user_id: id,
      },
      data: {
        follower: total_follow,
      },
    });
  }

  async updateReport(id: number, total_report: number) {
    return await this.prisma.user.update({
      where: {
        user_id: id,
      },
      data: {
        total_reports: total_report,
      },
    });
  }
}
