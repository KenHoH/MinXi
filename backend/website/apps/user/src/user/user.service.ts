import {
  HttpStatus,
  Injectable,
  InternalServerErrorException,
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
import { rpcError } from './utils/RpcError';
import { RpcCustomException } from '@app/common/errors/error-rpc';

@Injectable()
export class UserService implements IUserService {
  private readonly logger = new Logger(UserService.name);
  constructor(private readonly repo: Repository) {}

  async create(dto: CreateUserDto): Promise<Ack> {
    try {
      await this.repo.createUser(dto);
      return {
        Msg: `User '${dto.username}' created successfully`,
        Valid: true,
      };
    } catch (error) {
      this.logger.error(
        `Failed to create user '${dto.username}': ${error.message}`,
      );
      throw rpcError(HttpStatus.INTERNAL_SERVER_ERROR, 'Failed to create user');
    }
  }

  async findAll() {
    try {
      const users = await this.repo.findAll();
      return users.map(mapToDto);
    } catch (error) {
      this.logger.error(`Error fetching users: ${error.message}`);
      throw rpcError(
        HttpStatus.INTERNAL_SERVER_ERROR,
        'Failed to fetch all users',
      );
    }
  }

  async findOne(id: number) {
    const user = await this.repo.findOne(id);
    if (!user) {
      this.logger.warn(`User with ID ${id} not found`);
      throw new RpcCustomException(404, 'User not found', { id });
    }
    return mapToDto(user);
  }

  async updateProfile(id: number, dto: UpdateProfileUserDto) {
    try {
      const user = await this.repo.findOne(id);
      if (!user) {
        this.logger.warn(`User with ID ${id} not found for profile update`);
        throw rpcError(HttpStatus.NOT_FOUND, `User with ID ${id} not found`);
      }

      const updatedUser = await this.repo.updateProfile(id, dto);
      return mapToDto(updatedUser);
    } catch (error) {
      this.logger.error(
        `Failed to update profile for user ${id}: ${error.message}`,
      );
      throw rpcError(400, 'Failed to update user profile');
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
      throw rpcError(
        HttpStatus.INTERNAL_SERVER_ERROR,
        'Failed to update restriction',
      );
    }
  }

  async updateLike(id: number, delta: number): Promise<Ack> {
    const user = await this.repo.findOne(id);
    if (!user) {
      this.logger.warn(`User with ID ${id} not found for like update`);
      throw rpcError(HttpStatus.NOT_FOUND, `User with ID ${id} not found`);
    }

    user.total_like += delta;
    const result = await this.repo.updateLike(id, user.total_like);

    if (!result) {
      return { Msg: 'Failed to update like', Valid: false };
    }

    return { Msg: 'Like count updated successfully', Valid: true };
  }

  async updateFollow(id: number, delta: number): Promise<Ack> {
    try {
      const user = await this.repo.findOne(id);
      if (!user) {
        this.logger.warn(`User with ID ${id} not found for follow update`);
        throw rpcError(HttpStatus.NOT_FOUND, `User with ID ${id} not found`);
      }

      user.follower += delta;
      const result = await this.repo.updateFollow(id, user.follower);

      if (!result) {
        return { Msg: 'Failed to update follower count', Valid: false };
      }

      return { Msg: 'Follower count updated successfully', Valid: true };
    } catch (error) {
      this.logger.error(
        `Error updating follow for user ${id}: ${error.message}`,
      );
      throw rpcError(
        HttpStatus.INTERNAL_SERVER_ERROR,
        'Failed to update follower count',
      );
    }
  }

  async updateReport(id: number, delta: number): Promise<Ack> {
    try {
      const user = await this.repo.findOne(id);
      if (!user) {
        this.logger.warn(`User with ID ${id} not found for report update`);
        throw rpcError(HttpStatus.NOT_FOUND, `User with ID ${id} not found`);
      }

      user.total_reports += delta;
      const result = await this.repo.updateReport(id, user.total_reports);

      if (!result) {
        return { Msg: 'Failed to update report count', Valid: false };
      }

      return { Msg: 'Report count updated successfully', Valid: true };
    } catch (error) {
      this.logger.error(
        `Error updating report for user ${id}: ${error.message}`,
      );
      throw rpcError(
        HttpStatus.INTERNAL_SERVER_ERROR,
        'Failed to update report count',
      );
    }
  }

  async remove(id: number): Promise<Ack> {
    try {
      const result = await this.repo.remove(id);
      if (!result) {
        return { Msg: 'Failed to delete user', Valid: false };
      }

      return { Msg: 'User deleted successfully', Valid: true };
    } catch (error) {
      this.logger.error(`Error deleting user ${id}: ${error.message}`);
      throw rpcError(HttpStatus.INTERNAL_SERVER_ERROR, 'Failed to delete user');
    }
  }
}
