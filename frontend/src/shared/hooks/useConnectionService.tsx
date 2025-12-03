import { ConnectionService } from "../../service/api/services/ConnectionService";
import type { Ack } from "../../service/api/models/Ack";
import type { FollowerDto } from "../../service/api/models/FollowerDto";
import type { FollowingDto } from "../../service/api/models/FollowingDto";
import type { FriendDto } from "../../service/api/models/FriendDto";
import type { UserDto } from "../../service/api/models/UserDto";
import useApiCall from "./useApiCall";

export default function useConnectionService() {
  const { call, data, loading, error } = useApiCall();

  const createFollow = (creatorId: number, followerId: number) =>
    call<Ack>(() =>
      ConnectionService.connectionControllerCreateFollow(creatorId, followerId)
    );

  const createFriend = (userId: number, friendId: number) =>
    call<Ack>(() =>
      ConnectionService.connectionControllerCreateFriend(userId, friendId)
    );

  const checkFollow = (creatorId: number, followerId: number) =>
    call<boolean>(() =>
      ConnectionService.connectionControllerCheckFollow(creatorId, followerId)
    );

  const checkFriend = (userId: number, friendId: number) =>
    call<boolean>(() =>
      ConnectionService.connectionControllerCheckFriend(userId, friendId)
    );

  const checkFriendMutual = (userId: number, friendId: number) =>
    call<boolean>(() =>
      ConnectionService.connectionControllerCheckFriendMutual(userId, friendId)
    );

  const deleteFollow = (creatorId: number, userId: number) =>
    call<Ack>(() =>
      ConnectionService.connectionControllerDeleteFollow(creatorId, userId)
    );

  const deleteFriend = (creatorId: number, userId: number) =>
    call<Ack>(() =>
      ConnectionService.connectionControllerDeleteFriend(creatorId, userId)
    );

  const getFollowersByCreator = (creatorId: number) =>
    call<FollowerDto[]>(() =>
      ConnectionService.connectionControllerGetFollowersByCreator(creatorId)
    );

  const getFollowingByUser = (userId: number) =>
    call<FollowingDto[]>(() =>
      ConnectionService.connectionControllerGetFollowingByUser(userId)
    );

  const getFriendsByUser = (userId: number) =>
    call<FriendDto[]>(() =>
      ConnectionService.connectionControllerGetFriendsbyUser(userId)
    );

  const getFollowingCount = (userId: number) =>
    call<number>(() =>
      ConnectionService.connectionControllerGetFollowingCount(userId)
    );

  const getFollowersInstanceByCreator = (creatorId: number) =>
    call<UserDto[]>(() =>
      ConnectionService.connectionControllerGetFollowersInstanceByCreator(
        creatorId
      )
    );

  const getFriendsInstanceByUser = (userId: number) =>
    call<UserDto[]>(() =>
      ConnectionService.connectionControllerGetFriendsInstanceByUser(userId)
    );

  const getFollowingInstanceByUser = (userId: number) =>
    call<UserDto[]>(() =>
      ConnectionService.connectionControllerGetFollowingInstanceByUser(userId)
    );

  return {
    createFollow,
    createFriend,
    checkFollow,
    checkFriend,
    checkFriendMutual,
    deleteFollow,
    deleteFriend,
    getFollowersByCreator,
    getFollowingByUser,
    getFriendsByUser,
    getFollowingCount,
    getFollowersInstanceByCreator,
    getFriendsInstanceByUser,
    getFollowingInstanceByUser,
    result: data,
    loading,
    error,
  };
}
