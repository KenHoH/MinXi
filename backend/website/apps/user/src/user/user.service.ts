import {
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from '@app/contracts/shared-dto/user/create-user.dto';
import {
  UpdateProfileUserDto,
  UpdateRestriction,
} from '@app/contracts/shared-dto/user/update-user.dto';
import { Repository } from './repository/repository';
import { IUserService } from '@app/common/interfaces/user/IUserService';
import { Ack } from '@app/contracts/shared-dto/ack.dto';
import { mapToDto } from './utils/mapToDto';
import { httpToRpc } from '@app/common/utils/httpToRpc';
import * as bcrypt from 'bcrypt';
import { UserDto } from '@app/contracts/shared-dto/user/user.dto';
import { NameRequest } from '@app/contracts/shared-dto/user/find.name.dto';
import { CredentialRes } from '@app/contracts/shared-dto/user/Creds.dto';

@Injectable()
export class UserService implements IUserService {
  private readonly logger = new Logger(UserService.name);
  constructor(private readonly repo: Repository) {}

  async create(dto: CreateUserDto): Promise<Ack> {
    try {
      const hash = await bcrypt.hash(dto.password, 10);
      dto.password = hash;

      await this.repo.createUser(dto);
      return {
        Msg: `User '${dto.username}' created successfully`,
        Valid: true,
      };
    } catch (error) {
      this.logger.error(
        `Failed to create user '${dto.username}': ${error.message}`,
      );
      throw httpToRpc(
        new HttpException('Failed to Create User', HttpStatus.BAD_REQUEST),
      );
    }
  }

  async findAll() {
    try {
      const users = await this.repo.findAll();
      if (!users) {
        throw httpToRpc(
          new HttpException('Error Fetching All Users', HttpStatus.NOT_FOUND),
        );
      }
      return users.map(mapToDto);
    } catch (error) {
      this.logger.error(`Error fetching users: ${error.message}`);
      throw httpToRpc(
        new HttpException('Error Fetching All Users', HttpStatus.BAD_REQUEST),
      );
    }
  }

  async findOne(id: number) {
    try {
      const user = await this.repo.findOne(id);
      if (!user) {
        this.logger.warn(`User with ID ${id} not found`);
        throw httpToRpc(new NotFoundException('User not found'));
      }
      return mapToDto(user);
    } catch (error) {
      this.logger.error(`Failed to find user ${id}: ${error.message}`);
      throw httpToRpc(
        new HttpException('Failed to find user', HttpStatus.BAD_REQUEST),
      );
    }
  }

  async updateProfile(id: number, dto: UpdateProfileUserDto) {
    try {
      this.logger.log(dto);
      const updatedUser = await this.repo.updateProfile(id, dto);
      return mapToDto(updatedUser);
    } catch (error) {
      this.logger.error(
        `Failed to update profile for user ${id}: ${error.message}`,
      );
      throw httpToRpc(
        new HttpException(
          'Failed to update user profile',
          HttpStatus.BAD_REQUEST,
        ),
      );
    }
  }

  async updateRestriction(id: number, dto: UpdateRestriction): Promise<Ack> {
    try {
      await this.repo.updateRestriction(id, dto);
      return { Msg: 'Restriction updated successfully', Valid: true };
    } catch (error) {
      this.logger.error(
        `Failed to update restriction for user ${id}: ${error.message}`,
      );
      throw httpToRpc(
        new HttpException(
          'Failed to update user restriction',
          HttpStatus.BAD_REQUEST,
        ),
      );
    }
  }

  async updateLike(id: number, delta: number): Promise<Ack> {
    try {
      const user = await this.repo.findOne(id);
      if (!user) {
        this.logger.warn(`User with ID ${id} not found for like update`);
        throw httpToRpc(new NotFoundException('User not found'));
      }

      user.total_like += delta;
      const result = await this.repo.updateLike(id, user.total_like);

      if (!result) {
        return { Msg: 'Failed to update like', Valid: false };
      }

      return { Msg: 'Like count updated successfully', Valid: true };
    } catch (error) {
      this.logger.error(
        `Failed to update like for user ${id}: ${error.message}`,
      );
      throw httpToRpc(
        new HttpException(
          'Failed to update like count',
          HttpStatus.BAD_REQUEST,
        ),
      );
    }
  }

  async updateFollow(id: number, delta: number): Promise<Ack> {
    try {
      const user = await this.repo.findOne(id);
      if (!user) {
        this.logger.warn(`User with ID ${id} not found for follow update`);
        throw httpToRpc(new NotFoundException('User not found'));
      }

      user.follower += delta;
      const result = await this.repo.updateFollow(id, user.follower);

      if (!result) {
        return { Msg: 'Failed to update follower count', Valid: false };
      }

      return { Msg: 'Follower count updated successfully', Valid: true };
    } catch (error) {
      this.logger.error(
        `Failed to update follower count for user ${id}: ${error.message}`,
      );
      throw httpToRpc(
        new HttpException(
          'Failed to update follower count',
          HttpStatus.BAD_REQUEST,
        ),
      );
    }
  }

  async updateReport(id: number, delta: number): Promise<Ack> {
    try {
      const user = await this.repo.findOne(id);
      if (!user) {
        this.logger.warn(`User with ID ${id} not found for report update`);
        throw httpToRpc(new NotFoundException('User not found'));
      }

      user.total_reports += delta;
      const result = await this.repo.updateReport(id, user.total_reports);

      if (!result) {
        return { Msg: 'Failed to update report count', Valid: false };
      }

      return { Msg: 'Report count updated successfully', Valid: true };
    } catch (error) {
      this.logger.error(
        `Failed to update report count for user ${id}: ${error.message}`,
      );
      throw httpToRpc(
        new HttpException(
          'Failed to update report count',
          HttpStatus.BAD_REQUEST,
        ),
      );
    }
  }

  async remove(id: number): Promise<Ack> {
    try {
      const result = await this.repo.remove(id);
      if (!result) {
        throw httpToRpc(new NotFoundException('User not found'));
      }
      return { Msg: 'User deleted successfully', Valid: true };
    } catch (error) {
      this.logger.error(`Failed to delete user ${id}: ${error.message}`);
      throw httpToRpc(
        new HttpException('Failed to delete user', HttpStatus.BAD_REQUEST),
      );
    }
  }

  async findByName(dto: NameRequest): Promise<CredentialRes> {
    try {
      this.logger.log(dto);
      const result = await this.repo.findByName(dto.name);
      if (!result) {
        this.logger.warn('User not found by name');
        throw httpToRpc(
          new HttpException('User Not Found By Name', HttpStatus.NOT_FOUND),
        );
      }
      return {
        username: result.username,
        password: result.password,
        user_id: result.user_id,
      };
    } catch (error) {
      this.logger.error(`Failed to find user by name: ${error.message}`);
      throw httpToRpc(
        new HttpException(
          'Failed to find user by name',
          HttpStatus.BAD_REQUEST,
        ),
      );
    }
  }
}
