import { Controller, Logger, UsePipes, ValidationPipe } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ConnectionService } from './connection.service';
import { CONNECTION_MSG } from '@app/common/constants/messageEvent';
import { Ack } from '@app/contracts/shared-dto/ack.dto';
import {
  CreateFollowDto,
  CreateFriendDto,
  DeleteFollowDto,
  DeleteFriendDto,
  CheckFollowDto,
  CheckFriendDto,
  CheckMutualDto,
  GetByIdDto,
} from '@app/contracts/shared-dto/connection/request';
import {
  FollowerDto,
  FriendDto,
  FollowingDto,
} from '@app/contracts/shared-dto/connection/response';
import { UserDto } from '@app/contracts/shared-dto/user/user.dto';

@Controller()
@UsePipes(new ValidationPipe())
export class ConnectionController {
  private readonly logger = new Logger(ConnectionController.name);

  constructor(private readonly connectionService: ConnectionService) {}

  @MessagePattern(CONNECTION_MSG.createFollow)
  async createFollow(@Payload() payload: CreateFollowDto): Promise<Ack> {
    return this.connectionService.createFollow(
      payload.creator_id,
      payload.follower_id,
    );
  }

  @MessagePattern(CONNECTION_MSG.createFriend)
  async createFriend(@Payload() payload: CreateFriendDto): Promise<Ack> {
    return this.connectionService.createFriend(
      payload.user_id,
      payload.friend_id,
    );
  }

  @MessagePattern(CONNECTION_MSG.checkFollow)
  async checkFollow(@Payload() payload: CheckFollowDto): Promise<boolean> {
    return this.connectionService.checkFollow(
      payload.creator_id,
      payload.follower_id,
    );
  }

  @MessagePattern(CONNECTION_MSG.checkFriend)
  async checkFriend(@Payload() payload: CheckFriendDto): Promise<boolean> {
    return this.connectionService.checkFriend(
      payload.user_id,
      payload.friend_id,
    );
  }

  @MessagePattern(CONNECTION_MSG.checkFriendMutual)
  async checkFriendMutual(
    @Payload() payload: CheckMutualDto,
  ): Promise<boolean> {
    return this.connectionService.checkFriendMutual(
      payload.user_id,
      payload.friend_id,
    );
  }

  @MessagePattern(CONNECTION_MSG.getFollowersByCreator)
  async getFollowersByCreator(
    @Payload() payload: GetByIdDto,
  ): Promise<FollowerDto[]> {
    return this.connectionService.getFollowersByCreator(payload.id);
  }

  @MessagePattern(CONNECTION_MSG.getFriendsbyUser)
  async getFriendsbyUser(@Payload() payload: GetByIdDto): Promise<FriendDto[]> {
    return this.connectionService.getFriendsbyUser(payload.id);
  }

  @MessagePattern(CONNECTION_MSG.getFollowingByUser)
  async getFollowingByUser(
    @Payload() payload: GetByIdDto,
  ): Promise<FollowingDto[]> {
    this.logger.log(`Getting following list for user ID ${payload.id}`);
    return this.connectionService.getFollowingByUser(payload.id);
  }

  @MessagePattern(CONNECTION_MSG.deleteFriend)
  async deleteFriend(@Payload() payload: DeleteFriendDto): Promise<Ack> {
    return this.connectionService.deleteFriend(
      payload.creator_id,
      payload.user_id,
    );
  }

  @MessagePattern(CONNECTION_MSG.deleteFollow)
  async deleteFollow(@Payload() payload: DeleteFollowDto): Promise<Ack> {
    return this.connectionService.deleteFollow(
      payload.creator_id,
      payload.user_id,
    );
  }

  @MessagePattern(CONNECTION_MSG.getFollowingCount)
  async getFollowingCount(@Payload() user_id: number): Promise<number> {
    return this.connectionService.getFollowingCount(user_id);
  }

  @MessagePattern(CONNECTION_MSG.getFollowersInstanceByCreator)
  async getFollowersInstanceByCreator(
    @Payload() creator_id: number,
  ): Promise<UserDto[]> {
    return this.connectionService.getFollowersInstanceByCreator(creator_id);
  }

  @MessagePattern(CONNECTION_MSG.getFriendsInstanceByUser)
  async getFriendsInstanceByUser(
    @Payload() user_id: number,
  ): Promise<UserDto[]> {
    return this.connectionService.getFriendsInstanceByUser(user_id);
  }

  @MessagePattern(CONNECTION_MSG.getFollowingInstanceByUser)
  async getFollowingInstanceByUser(
    @Payload() user_id: number,
  ): Promise<UserDto[]> {
    return this.connectionService.getFollowingInstanceByUser(user_id);
  }
}
