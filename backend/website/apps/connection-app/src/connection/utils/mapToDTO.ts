import {
  FollowerDto,
  FriendDto,
  FollowingDto,
} from '@app/contracts/shared-dto/connection/response';

export function mapFollowerToDto(follow: any): FollowerDto {
  return {
    id: follow.id,
    creator_id: follow.creator_id,
    follower_id: follow.follower_id,
  };
}

export function mapFriendToDto(friend: any): FriendDto {
  return {
    id: friend.id,
    user_id: friend.user_id,
    friend_id: friend.friend_id,
  };
}

export function mapFollowingToDto(follow: any): FollowingDto {
  return {
    id: follow.id,
    creator_id: follow.creator_id,
    follower_id: follow.follower_id,
  };
}
