import {
  Controller,
  Get,
  Post,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  Logger,
  ParseIntPipe,
} from '@nestjs/common';
import { ConnectionService } from './connection.service';
import { JwtAuthGuard } from '@app/common/guard/jwt-auth-guard/jwt-auth.guard';
import { LogInterceptor } from '@app/common/interceptor/log/log.interceptor';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Ack } from '@app/contracts/shared-dto/ack.dto';
import {
  FollowerDto,
  FriendDto,
  FollowingDto,
} from '@app/contracts/shared-dto/connection/response';
import { Public } from '@app/common/decorators/public.decorator';
import { UserDto } from '@app/contracts/shared-dto/user/user.dto';

@Controller('connection')
@UseGuards(JwtAuthGuard)
@UseInterceptors(LogInterceptor)
@ApiBearerAuth()
export class ConnectionController {
  private readonly logger = new Logger(ConnectionController.name);

  constructor(private readonly connectionService: ConnectionService) {}

  @Post('follow/:creator_id/:follower_id')
  async createFollow(
    @Param('creator_id', ParseIntPipe) creator_id: number,
    @Param('follower_id', ParseIntPipe) follower_id: number,
  ): Promise<Ack> {
    return this.connectionService.createFollow(creator_id, follower_id);
  }

  @Post('friend/:user_id/:friend_id')
  async createFriend(
    @Param('user_id', ParseIntPipe) user_id: number,
    @Param('friend_id', ParseIntPipe) friend_id: number,
  ): Promise<Ack> {
    return this.connectionService.createFriend(user_id, friend_id);
  }

  @Public()
  @Get('check-follow/:creator_id/:follower_id')
  async checkFollow(
    @Param('creator_id', ParseIntPipe) creator_id: number,
    @Param('follower_id', ParseIntPipe) follower_id: number,
  ): Promise<boolean> {
    return this.connectionService.checkFollow(creator_id, follower_id);
  }

  @Public()
  @Get('check-friend/:user_id/:friend_id')
  async checkFriend(
    @Param('user_id', ParseIntPipe) user_id: number,
    @Param('friend_id', ParseIntPipe) friend_id: number,
  ): Promise<boolean> {
    return this.connectionService.checkFriend(user_id, friend_id);
  }

  @Public()
  @Get('check-mutual/:user_id/:friend_id')
  async checkFriendMutual(
    @Param('user_id', ParseIntPipe) user_id: number,
    @Param('friend_id', ParseIntPipe) friend_id: number,
  ): Promise<boolean> {
    return this.connectionService.checkFriendMutual(user_id, friend_id);
  }

  @Public()
  @Get('followers/:creator_id')
  async getFollowersByCreator(
    @Param('creator_id', ParseIntPipe) creator_id: number,
  ): Promise<FollowerDto[]> {
    return this.connectionService.getFollowersByCreator(creator_id);
  }

  @Public()
  @Get('friends/:user_id')
  async getFriendsbyUser(
    @Param('user_id', ParseIntPipe) user_id: number,
  ): Promise<FriendDto[]> {
    return this.connectionService.getFriendsbyUser(user_id);
  }

  @Public()
  @Get('following/:user_id')
  async getFollowingByUser(
    @Param('user_id', ParseIntPipe) user_id: number,
  ): Promise<FollowingDto[]> {
    return this.connectionService.getFollowingByUser(user_id);
  }
  @Public()
  @Get('following-count/:user_id')
  async getFollowingCount(
    @Param('user_id', ParseIntPipe) user_id: number,
  ): Promise<number> {
    return this.connectionService.getFollowingCount(user_id);
  }

  @Public()
  @Get('followers-instance/:creator_id')
  async getFollowersInstanceByCreator(
    @Param('creator_id', ParseIntPipe) creator_id: number,
  ): Promise<UserDto[]> {
    return this.connectionService.getFollowersInstanceByCreator(creator_id);
  }

  @Public()
  @Get('friends-instance/:user_id')
  async getFriendsInstanceByUser(
    @Param('user_id', ParseIntPipe) user_id: number,
  ): Promise<UserDto[]> {
    return this.connectionService.getFriendsInstanceByUser(user_id);
  }

  @Public()
  @Get('following-instance/:user_id')
  async getFollowingInstanceByUser(
    @Param('user_id', ParseIntPipe) user_id: number,
  ): Promise<UserDto[]> {
    return this.connectionService.getFollowingInstanceByUser(user_id);
  }

  @Delete('friend/:creator_id/:user_id')
  async deleteFriend(
    @Param('creator_id', ParseIntPipe) creator_id: number,
    @Param('user_id', ParseIntPipe) user_id: number,
  ): Promise<Ack> {
    return this.connectionService.deleteFriend(creator_id, user_id);
  }

  @Delete('follow/:creator_id/:user_id')
  async deleteFollow(
    @Param('creator_id', ParseIntPipe) creator_id: number,
    @Param('user_id', ParseIntPipe) user_id: number,
  ): Promise<Ack> {
    return this.connectionService.deleteFollow(creator_id, user_id);
  }
}
