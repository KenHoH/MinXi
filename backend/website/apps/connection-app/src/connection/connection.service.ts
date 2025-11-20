import { UserDatabaseConnection } from '@app/common/database/user-database-connection/user-database-connection';
import { httpToRpc } from '@app/common/utils/httpToRpc';
import { IConnectionService } from '@app/contracts/interfaces/app/IConnectionService';
import { Ack } from '@app/contracts/shared-dto/ack.dto';
import {
  FollowerDto,
  FriendDto,
  FollowingDto,
} from '@app/contracts/shared-dto/connection/response';
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import {
  mapFollowerToDto,
  mapFriendToDto,
  mapFollowingToDto,
} from './utils/mapToDTO';

@Injectable()
export class ConnectionService implements IConnectionService {
  private readonly logger = new Logger(ConnectionService.name);

  constructor(private readonly prisma: UserDatabaseConnection) {}

  async createFollow(creator_id: number, follower_id: number): Promise<Ack> {
    try {
      if (creator_id === follower_id) {
        throw httpToRpc(
          new HttpException('Cannot follow yourself', HttpStatus.BAD_REQUEST),
        );
      }

      const existingFollow = await this.checkFollow(creator_id, follower_id);
      if (existingFollow) {
        throw httpToRpc(
          new HttpException('Already following this user', HttpStatus.CONFLICT),
        );
      }

      await this.prisma.follow.create({
        data: {
          creator_id,
          follower_id,
        },
      });

      const mutualFollowExists = await this.checkFollow(
        follower_id,
        creator_id,
      );

      if (mutualFollowExists) {
        this.logger.log(
          `Mutual follow detected between ${creator_id} and ${follower_id}, creating friendship`,
        );
        try {
          await this.createFriend(creator_id, follower_id);
        } catch (friendError) {
          this.logger.warn(
            `Friendship already exists between ${creator_id} and ${follower_id}`,
          );
        }
      }

      return { Valid: true, Msg: 'Follow created successfully' };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      this.logger.error('Failed to create follow', error.message);
      throw httpToRpc(
        new HttpException(
          'Failed to create follow',
          HttpStatus.INTERNAL_SERVER_ERROR,
        ),
      );
    }
  }

  async createFriend(user_id: number, friend_id: number): Promise<Ack> {
    try {
      if (user_id === friend_id) {
        throw httpToRpc(
          new HttpException(
            'Cannot add yourself as friend',
            HttpStatus.BAD_REQUEST,
          ),
        );
      }

      const friendshipExists = await this.checkFriend(user_id, friend_id);
      if (friendshipExists) {
        throw httpToRpc(
          new HttpException(
            'Already friends with this user',
            HttpStatus.CONFLICT,
          ),
        );
      }

      await this.prisma.$transaction(async (tx) => {
        await tx.friend.create({
          data: {
            user_id,
            friend_id,
          },
        });

        await tx.friend.create({
          data: {
            user_id: friend_id,
            friend_id: user_id,
          },
        });
      });

      return { Valid: true, Msg: 'Friend added successfully' };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      if (error.code === 'P2002') {
        throw httpToRpc(
          new HttpException('Friendship already exists', HttpStatus.CONFLICT),
        );
      }
      this.logger.error('Failed to create friend', error.message);
      throw httpToRpc(
        new HttpException(
          'Failed to create friend',
          HttpStatus.INTERNAL_SERVER_ERROR,
        ),
      );
    }
  }

  async checkFollow(creator_id: number, follower_id: number): Promise<boolean> {
    try {
      const follow = await this.prisma.follow.findUnique({
        where: {
          creator_id_follower_id: {
            creator_id,
            follower_id,
          },
        },
      });

      return !!follow;
    } catch (error) {
      this.logger.error('Failed to check follow', error.message);
      throw httpToRpc(
        new HttpException(
          'Failed to check follow',
          HttpStatus.INTERNAL_SERVER_ERROR,
        ),
      );
    }
  }

  async checkFriend(user_id: number, friend_id: number): Promise<boolean> {
    try {
      const friend = await this.prisma.friend.findUnique({
        where: {
          user_id_friend_id: {
            user_id,
            friend_id,
          },
        },
      });

      return !!friend;
    } catch (error) {
      this.logger.error('Failed to check friend', error.message);
      throw httpToRpc(
        new HttpException(
          'Failed to check friend',
          HttpStatus.INTERNAL_SERVER_ERROR,
        ),
      );
    }
  }

  async checkFriendMutual(
    user_id: number,
    friend_id: number,
  ): Promise<boolean> {
    try {
      const friendship1 = await this.checkFriend(user_id, friend_id);
      const friendship2 = await this.checkFriend(friend_id, user_id);

      return friendship1 && friendship2;
    } catch (error) {
      this.logger.error('Failed to check mutual friend', error.message);
      throw httpToRpc(
        new HttpException(
          'Failed to check mutual friend',
          HttpStatus.INTERNAL_SERVER_ERROR,
        ),
      );
    }
  }

  async getFollowersByCreator(creator_id: number): Promise<FollowerDto[]> {
    try {
      const followers = await this.prisma.follow.findMany({
        where: {
          creator_id,
        },
      });

      return followers.map((follower) => mapFollowerToDto(follower));
    } catch (error) {
      this.logger.error('Failed to fetch followers', error.message);
      throw httpToRpc(
        new HttpException(
          'Failed to fetch followers',
          HttpStatus.INTERNAL_SERVER_ERROR,
        ),
      );
    }
  }

  async getFriendsbyUser(user_id: number): Promise<FriendDto[]> {
    try {
      const friends = await this.prisma.friend.findMany({
        where: {
          user_id,
        },
      });

      return friends.map((friend) => mapFriendToDto(friend));
    } catch (error) {
      this.logger.error('Failed to fetch friends', error.message);
      throw httpToRpc(
        new HttpException(
          'Failed to fetch friends',
          HttpStatus.INTERNAL_SERVER_ERROR,
        ),
      );
    }
  }

  async getFollowingByUser(user_id: number): Promise<FollowingDto[]> {
    try {
      const following = await this.prisma.follow.findMany({
        where: {
          follower_id: user_id,
        },
      });

      return following.map((follow) => mapFollowingToDto(follow));
    } catch (error) {
      this.logger.error('Failed to fetch following', error.message);
      throw httpToRpc(
        new HttpException(
          'Failed to fetch following',
          HttpStatus.INTERNAL_SERVER_ERROR,
        ),
      );
    }
  }

  async deleteFriend(user_a_id: number, user_b_id: number): Promise<Ack> {
    try {
      const friendshipExists = await this.checkFriendMutual(
        user_a_id,
        user_b_id,
      );
      if (!friendshipExists) {
        throw httpToRpc(
          new HttpException('Friendship not found', HttpStatus.NOT_FOUND),
        );
      }

      await this.prisma.$transaction(async (tx) => {
        await tx.friend.deleteMany({
          where: {
            user_id: user_a_id,
            friend_id: user_b_id,
          },
        });

        await tx.friend.deleteMany({
          where: {
            user_id: user_b_id,
            friend_id: user_a_id,
          },
        });
      });

      return { Valid: true, Msg: 'Friend removed successfully' };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      this.logger.error('Failed to delete friend', error.message);
      throw httpToRpc(
        new HttpException(
          'Failed to delete friend',
          HttpStatus.INTERNAL_SERVER_ERROR,
        ),
      );
    }
  }

  async deleteFollow(creator_id: number, follower_id: number): Promise<Ack> {
    try {
      const followExists = await this.checkFollow(creator_id, follower_id);
      if (!followExists) {
        throw httpToRpc(
          new HttpException('Follow not found', HttpStatus.NOT_FOUND),
        );
      }

      await this.prisma.follow.deleteMany({
        where: {
          creator_id,
          follower_id,
        },
      });

      const isFriend = await this.checkFriendMutual(creator_id, follower_id);
      const stillMutualFollow = await this.checkFollow(follower_id, creator_id);

      if (isFriend && !stillMutualFollow) {
        this.logger.log(
          `Mutual follow no longer exists between ${creator_id} and ${follower_id}, removing friendship`,
        );
        await this.prisma.$transaction(async (tx) => {
          await tx.friend.deleteMany({
            where: {
              user_id: creator_id,
              friend_id: follower_id,
            },
          });

          await tx.friend.deleteMany({
            where: {
              user_id: follower_id,
              friend_id: creator_id,
            },
          });
        });
      }

      return { Valid: true, Msg: 'Follow removed successfully' };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      this.logger.error('Failed to delete follow', error.message);
      throw httpToRpc(
        new HttpException(
          'Failed to delete follow',
          HttpStatus.INTERNAL_SERVER_ERROR,
        ),
      );
    }
  }
}
