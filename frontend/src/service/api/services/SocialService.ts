/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AddUserToRoomDto } from '../models/AddUserToRoomDto';
import type { CreateRoomDto } from '../models/CreateRoomDto';
import type { FindDmDto } from '../models/FindDmDto';
import type { MessageResponseDto } from '../models/MessageResponseDto';
import type { ParticipantResponseDto } from '../models/ParticipantResponseDto';
import type { ParticipantTotalResDTO } from '../models/ParticipantTotalResDTO';
import type { RemoveUserFromRoomDto } from '../models/RemoveUserFromRoomDto';
import type { RoomResponseDto } from '../models/RoomResponseDto';
import type { SendMessageDto } from '../models/SendMessageDto';
import type { UpdateParticipantRoleDto } from '../models/UpdateParticipantRoleDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class SocialService {
    /**
     * @param requestBody
     * @returns RoomResponseDto
     * @throws ApiError
     */
    public static socialControllerCreateRoom(
        requestBody: CreateRoomDto,
    ): CancelablePromise<RoomResponseDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/social/room',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param roomId
     * @returns RoomResponseDto
     * @throws ApiError
     */
    public static socialControllerGetRoomInfo(
        roomId: string,
    ): CancelablePromise<RoomResponseDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/social/room/{roomId}',
            path: {
                'roomId': roomId,
            },
        });
    }
    /**
     * @param userId
     * @returns RoomResponseDto
     * @throws ApiError
     */
    public static socialControllerGetAllRoomId(
        userId: number,
    ): CancelablePromise<Array<RoomResponseDto>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/social/rooms/user/{userId}',
            path: {
                'userId': userId,
            },
        });
    }
    /**
     * @param requestBody
     * @returns ParticipantResponseDto
     * @throws ApiError
     */
    public static socialControllerAddUserToRoom(
        requestBody: AddUserToRoomDto,
    ): CancelablePromise<ParticipantResponseDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/social/room/add-user',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param requestBody
     * @returns ParticipantResponseDto
     * @throws ApiError
     */
    public static socialControllerRemoveUserFromRoom(
        requestBody: RemoveUserFromRoomDto,
    ): CancelablePromise<ParticipantResponseDto> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/social/room/remove-user',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param requestBody
     * @returns ParticipantResponseDto
     * @throws ApiError
     */
    public static socialControllerUpdateParticipantRole(
        requestBody: UpdateParticipantRoleDto,
    ): CancelablePromise<ParticipantResponseDto> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/social/room/update-role',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param roomId
     * @returns ParticipantTotalResDTO
     * @throws ApiError
     */
    public static socialControllerGetTotalParticipants(
        roomId: string,
    ): CancelablePromise<ParticipantTotalResDTO> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/social/room/{roomId}/participants',
            path: {
                'roomId': roomId,
            },
        });
    }
    /**
     * @param roomId
     * @returns ParticipantResponseDto
     * @throws ApiError
     */
    public static socialControllerGetParticipant(
        roomId: string,
    ): CancelablePromise<ParticipantResponseDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/social/room/{roomId}/participantDM',
            path: {
                'roomId': roomId,
            },
        });
    }
    /**
     * @param roomId
     * @returns MessageResponseDto
     * @throws ApiError
     */
    public static socialControllerGetMedia(
        roomId: string,
    ): CancelablePromise<MessageResponseDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/social/room/{roomId}/media',
            path: {
                'roomId': roomId,
            },
        });
    }
    /**
     * @param requestBody
     * @returns MessageResponseDto
     * @throws ApiError
     */
    public static socialControllerSendMessage(
        requestBody: SendMessageDto,
    ): CancelablePromise<MessageResponseDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/social/message',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param roomId
     * @param limit
     * @returns MessageResponseDto
     * @throws ApiError
     */
    public static socialControllerGetMessage(
        roomId: string,
        limit: number,
    ): CancelablePromise<Array<MessageResponseDto>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/social/room/{roomId}/messages',
            path: {
                'roomId': roomId,
            },
            query: {
                'limit': limit,
            },
        });
    }
    /**
     * @param requestBody
     * @returns RoomResponseDto
     * @throws ApiError
     */
    public static socialControllerFindDm(
        requestBody: FindDmDto,
    ): CancelablePromise<RoomResponseDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/social/dm/find',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
}
