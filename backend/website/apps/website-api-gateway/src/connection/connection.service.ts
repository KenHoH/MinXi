import { CONNECTION_MSG } from '@app/common/constants/messageEvent';
import { CONNECT_SERVICES } from '@app/common/constants/services';
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
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class ConnectionService {
  constructor(
    @Inject(CONNECT_SERVICES.CLIENT)
    private readonly connectClient: ClientProxy,
  ) {}

  async createFollow(creator_id: number, follower_id: number): Promise<Ack> {
    const payload = new CreateFollowDto();
    payload.creator_id = creator_id;
    payload.follower_id = follower_id;
    return await firstValueFrom(
      this.connectClient.send(CONNECTION_MSG.createFollow, payload),
    );
  }

  async createFriend(user_id: number, friend_id: number): Promise<Ack> {
    const payload = new CreateFriendDto();
    payload.user_id = user_id;
    payload.friend_id = friend_id;
    return await firstValueFrom(
      this.connectClient.send(CONNECTION_MSG.createFriend, payload),
    );
  }

  async checkFollow(creator_id: number, follower_id: number): Promise<boolean> {
    const payload = new CheckFollowDto();
    payload.creator_id = creator_id;
    payload.follower_id = follower_id;
    return await firstValueFrom(
      this.connectClient.send(CONNECTION_MSG.checkFollow, payload),
    );
  }

  async checkFriend(user_id: number, friend_id: number): Promise<boolean> {
    const payload = new CheckFriendDto();
    payload.user_id = user_id;
    payload.friend_id = friend_id;
    return await firstValueFrom(
      this.connectClient.send(CONNECTION_MSG.checkFriend, payload),
    );
  }

  async checkFriendMutual(
    user_id: number,
    friend_id: number,
  ): Promise<boolean> {
    const payload = new CheckMutualDto();
    payload.user_id = user_id;
    payload.friend_id = friend_id;
    return await firstValueFrom(
      this.connectClient.send(CONNECTION_MSG.checkFriendMutual, payload),
    );
  }

  async getFollowersByCreator(creator_id: number): Promise<FollowerDto[]> {
    const payload = new GetByIdDto();
    payload.id = creator_id;
    return await firstValueFrom(
      this.connectClient.send(CONNECTION_MSG.getFollowersByCreator, payload),
    );
  }

  async getFriendsbyUser(user_id: number): Promise<FriendDto[]> {
    const payload = new GetByIdDto();
    payload.id = user_id;
    return await firstValueFrom(
      this.connectClient.send(CONNECTION_MSG.getFriendsbyUser, payload),
    );
  }

  async getFollowingByUser(user_id: number): Promise<FollowingDto[]> {
    const payload = new GetByIdDto();
    payload.id = user_id;
    return await firstValueFrom(
      this.connectClient.send(CONNECTION_MSG.getFollowingByUser, payload),
    );
  }

  async deleteFriend(creator_id: number, user_id: number): Promise<Ack> {
    const payload = new DeleteFriendDto();
    payload.creator_id = creator_id;
    payload.user_id = user_id;
    return await firstValueFrom(
      this.connectClient.send(CONNECTION_MSG.deleteFriend, payload),
    );
  }

  async deleteFollow(creator_id: number, user_id: number): Promise<Ack> {
    const payload = new DeleteFollowDto();
    payload.creator_id = creator_id;
    payload.user_id = user_id;
    return await firstValueFrom(
      this.connectClient.send(CONNECTION_MSG.deleteFollow, payload),
    );
  }
}
