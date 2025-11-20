/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Ack } from '../models/Ack';
import type { FollowerDto } from '../models/FollowerDto';
import type { FollowingDto } from '../models/FollowingDto';
import type { FriendDto } from '../models/FriendDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ConnectionService {
    /**
     * @param creatorId
     * @param followerId
     * @returns Ack
     * @throws ApiError
     */
    public static connectionControllerCreateFollow(
        creatorId: number,
        followerId: number,
    ): CancelablePromise<Ack> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/connection/follow/{creator_id}/{follower_id}',
            path: {
                'creator_id': creatorId,
                'follower_id': followerId,
            },
        });
    }
    /**
     * @param userId
     * @param friendId
     * @returns Ack
     * @throws ApiError
     */
    public static connectionControllerCreateFriend(
        userId: number,
        friendId: number,
    ): CancelablePromise<Ack> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/connection/friend/{user_id}/{friend_id}',
            path: {
                'user_id': userId,
                'friend_id': friendId,
            },
        });
    }
    /**
     * @param creatorId
     * @param followerId
     * @returns boolean
     * @throws ApiError
     */
    public static connectionControllerCheckFollow(
        creatorId: number,
        followerId: number,
    ): CancelablePromise<boolean> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/connection/check-follow/{creator_id}/{follower_id}',
            path: {
                'creator_id': creatorId,
                'follower_id': followerId,
            },
        });
    }
    /**
     * @param userId
     * @param friendId
     * @returns boolean
     * @throws ApiError
     */
    public static connectionControllerCheckFriend(
        userId: number,
        friendId: number,
    ): CancelablePromise<boolean> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/connection/check-friend/{user_id}/{friend_id}',
            path: {
                'user_id': userId,
                'friend_id': friendId,
            },
        });
    }
    /**
     * @param userId
     * @param friendId
     * @returns boolean
     * @throws ApiError
     */
    public static connectionControllerCheckFriendMutual(
        userId: number,
        friendId: number,
    ): CancelablePromise<boolean> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/connection/check-mutual/{user_id}/{friend_id}',
            path: {
                'user_id': userId,
                'friend_id': friendId,
            },
        });
    }
    /**
     * @param creatorId
     * @returns FollowerDto
     * @throws ApiError
     */
    public static connectionControllerGetFollowersByCreator(
        creatorId: number,
    ): CancelablePromise<Array<FollowerDto>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/connection/followers/{creator_id}',
            path: {
                'creator_id': creatorId,
            },
        });
    }
    /**
     * @param userId
     * @returns FriendDto
     * @throws ApiError
     */
    public static connectionControllerGetFriendsbyUser(
        userId: number,
    ): CancelablePromise<Array<FriendDto>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/connection/friends/{user_id}',
            path: {
                'user_id': userId,
            },
        });
    }
    /**
     * @param userId
     * @returns FollowingDto
     * @throws ApiError
     */
    public static connectionControllerGetFollowingByUser(
        userId: number,
    ): CancelablePromise<Array<FollowingDto>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/connection/following/{user_id}',
            path: {
                'user_id': userId,
            },
        });
    }
    /**
     * @param creatorId
     * @param userId
     * @returns Ack
     * @throws ApiError
     */
    public static connectionControllerDeleteFriend(
        creatorId: number,
        userId: number,
    ): CancelablePromise<Ack> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/connection/friend/{creator_id}/{user_id}',
            path: {
                'creator_id': creatorId,
                'user_id': userId,
            },
        });
    }
    /**
     * @param creatorId
     * @param userId
     * @returns Ack
     * @throws ApiError
     */
    public static connectionControllerDeleteFollow(
        creatorId: number,
        userId: number,
    ): CancelablePromise<Ack> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/connection/follow/{creator_id}/{user_id}',
            path: {
                'creator_id': creatorId,
                'user_id': userId,
            },
        });
    }
}
