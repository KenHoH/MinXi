import { Ack } from '@app/contracts/shared-dto/ack.dto';
import {
  CreateFollowDto,
  CreateFriendDto,
  DeleteFollowDto,
  DeleteFriendDto,
} from '@app/contracts/shared-dto/connection/request';
import {
  FollowerDto,
  FriendDto,
  FollowingDto,
} from '@app/contracts/shared-dto/connection/response';
import { UserDto } from '@app/contracts/shared-dto/user/user.dto';

export interface IConnectionService {
  createFollow(creator_id: number, follower_id: number): Promise<Ack>;
  createFriend(user_id: number, friend_id: number): Promise<Ack>;
  checkFollow(creator_id: number, follower_id: number): Promise<boolean>;
  checkFriend(user_id: number, friend_id: number): Promise<boolean>;
  checkFriendMutual(user_id: number, friend_id: number): Promise<boolean>;
  getFollowersByCreator(creator_id: number): Promise<FollowerDto[]>;
  getFriendsbyUser(user_id: number): Promise<FriendDto[]>;
  getFollowingByUser(user_id: number): Promise<FollowingDto[]>;

  getFollowingCount(user_id: number): Promise<number>;
  getFollowersInstanceByCreator(creator_id: number): Promise<UserDto[]>;
  getFriendsInstanceByUser(user_id: number): Promise<UserDto[]>;
  getFollowingInstanceByUser(user_id: number): Promise<UserDto[]>;

  deleteFriend(creator_id: number, user_id: number): Promise<Ack>;
  deleteFollow(creator_id: number, user_id: number): Promise<Ack>;
}
