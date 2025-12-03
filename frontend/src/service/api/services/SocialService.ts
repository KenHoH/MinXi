/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Ack } from "../models/Ack";
import type { AddUserToRoomDto } from "../models/AddUserToRoomDto";
import type { FindDmDto } from "../models/FindDmDto";
import type { MessageResponseDto } from "../models/MessageResponseDto";
import type { ParticipantResponseDto } from "../models/ParticipantResponseDto";
import type { ParticipantTotalResDTO } from "../models/ParticipantTotalResDTO";
import type { RemoveUserFromRoomDto } from "../models/RemoveUserFromRoomDto";
import type { RoomResDmDto } from "../models/RoomResDmDto";
import type { RoomResponseDto } from "../models/RoomResponseDto";
import type { SendMessageDto } from "../models/SendMessageDto";
import type { UpdateParticipantRoleDto } from "../models/UpdateParticipantRoleDto";

import type { CancelablePromise } from "../core/CancelablePromise";
import { OpenAPI } from "../core/OpenAPI";
import { request as __request } from "../core/request";
import type { UserRoleDto } from "../models/UserRoleDto";
export class SocialService {
  /**
   * @param formData Create room
   * @returns RoomResponseDto Content created successfully
   * @throws ApiError
   */
  public static socialControllerCreateRoom(formData: {
    /**
     * Thumbnail image file (required for Group or Communities creation)
     */
    thumbnail?: Blob;
    /**
     * Array of user IDs to add to the room
     */
    members: Array<number>;
    /**
     * ID of the Group or Community owner
     */
    owner_id?: number;
    /**
     * Type of Room, DIRECT, GROUP, COMMUNITY
     */
    room_type: string;
    /**
     * Room name or Group/Community name
     */
    name_room?: string;
  }): CancelablePromise<RoomResponseDto> {
    return __request(OpenAPI, {
      method: "POST",
      url: "/social/room",
      formData: formData,
      mediaType: "multipart/form-data",
      errors: {
        400: `Bad request - missing required files or fields`,
      },
    });
  }
  /**
   * @param roomId
   * @returns RoomResponseDto
   * @throws ApiError
   */
  public static socialControllerGetRoomInfo(
    roomId: string
  ): CancelablePromise<RoomResponseDto> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/social/room/{roomId}",
      path: {
        roomId: roomId,
      },
    });
  }
  /**
   * @param roomId
   * @returns Ack
   * @throws ApiError
   */
  public static socialControllerDeleteRoom(
    roomId: string
  ): CancelablePromise<Ack> {
    return __request(OpenAPI, {
      method: "DELETE",
      url: "/social/room/{roomId}",
      path: {
        roomId: roomId,
      },
    });
  }
  /**
   * @param roomId
   * @returns UserRoleDto
   * @throws ApiError
   */
  public static socialControllerGetInstanceParticipant(
    roomId: string
  ): CancelablePromise<Array<UserRoleDto>> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/social/group/community/instance/{roomId}",
      path: {
        roomId: roomId,
      },
    });
  }
  /**
   * @param userId
   * @returns RoomResponseDto
   * @throws ApiError
   */
  public static socialControllerGetAllRoomId(
    userId: number
  ): CancelablePromise<Array<RoomResponseDto>> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/social/rooms/user/{userId}",
      path: {
        userId: userId,
      },
    });
  }
  /**
   * @param requestBody
   * @returns ParticipantResponseDto
   * @throws ApiError
   */
  public static socialControllerAddUserToRoom(
    requestBody: AddUserToRoomDto
  ): CancelablePromise<ParticipantResponseDto> {
    return __request(OpenAPI, {
      method: "POST",
      url: "/social/room/add-user",
      body: requestBody,
      mediaType: "application/json",
    });
  }
  /**
   * @param requestBody
   * @returns ParticipantResponseDto
   * @throws ApiError
   */
  public static socialControllerRemoveUserFromRoom(
    requestBody: RemoveUserFromRoomDto
  ): CancelablePromise<ParticipantResponseDto> {
    return __request(OpenAPI, {
      method: "DELETE",
      url: "/social/room/remove-user",
      body: requestBody,
      mediaType: "application/json",
    });
  }
  /**
   * @param requestBody
   * @returns ParticipantResponseDto
   * @throws ApiError
   */
  public static socialControllerUpdateParticipantRole(
    requestBody: UpdateParticipantRoleDto
  ): CancelablePromise<ParticipantResponseDto> {
    return __request(OpenAPI, {
      method: "PATCH",
      url: "/social/room/update-role",
      body: requestBody,
      mediaType: "application/json",
    });
  }
  /**
   * @param roomId
   * @returns ParticipantTotalResDTO
   * @throws ApiError
   */
  public static socialControllerGetTotalParticipants(
    roomId: string
  ): CancelablePromise<ParticipantTotalResDTO> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/social/room/{roomId}/participants",
      path: {
        roomId: roomId,
      },
    });
  }
  /**
   * @param roomId
   * @returns ParticipantResponseDto
   * @throws ApiError
   */
  public static socialControllerGetParticipant(
    roomId: string
  ): CancelablePromise<ParticipantResponseDto> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/social/room/{roomId}/participantDM",
      path: {
        roomId: roomId,
      },
    });
  }
  /**
   * @param roomId
   * @returns MessageResponseDto
   * @throws ApiError
   */
  public static socialControllerGetMedia(
    roomId: string
  ): CancelablePromise<Array<MessageResponseDto>> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/social/room/{roomId}/media",
      path: {
        roomId: roomId,
      },
    });
  }
  /**
   * @param requestBody
   * @returns MessageResponseDto
   * @throws ApiError
   */
  public static socialControllerSendMessage(
    requestBody: SendMessageDto
  ): CancelablePromise<MessageResponseDto> {
    return __request(OpenAPI, {
      method: "POST",
      url: "/social/message",
      body: requestBody,
      mediaType: "application/json",
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
    limit: number
  ): CancelablePromise<Array<MessageResponseDto>> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/social/room/{roomId}/messages",
      path: {
        roomId: roomId,
      },
      query: {
        limit: limit,
      },
    });
  }
  /**
   * @param roomId
   * @returns Ack
   * @throws ApiError
   */
  public static socialControllerDeleteMessageByRoom(
    roomId: string
  ): CancelablePromise<Ack> {
    return __request(OpenAPI, {
      method: "DELETE",
      url: "/social/room/{roomId}/messages",
      path: {
        roomId: roomId,
      },
    });
  }
  /**
   * @param requestBody
   * @returns RoomResponseDto
   * @throws ApiError
   */
  public static socialControllerFindDm(
    requestBody: FindDmDto
  ): CancelablePromise<RoomResponseDto> {
    return __request(OpenAPI, {
      method: "POST",
      url: "/social/dm/find",
      body: requestBody,
      mediaType: "application/json",
    });
  }
  /**
   * @param id
   * @returns Ack
   * @throws ApiError
   */
  public static socialControllerDeleteMessage(
    id: string
  ): CancelablePromise<Ack> {
    return __request(OpenAPI, {
      method: "DELETE",
      url: "/social/message/{id}",
      path: {
        id: id,
      },
    });
  }
  /**
   * @param userId
   * @returns RoomResDmDto DM rooms with participant user information
   * @throws ApiError
   */
  public static socialControllerGetRoomDmByUserId(
    userId: number
  ): CancelablePromise<Array<RoomResDmDto>> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/social/dm/user/{userId}",
      path: {
        userId: userId,
      },
    });
  }
  /**
   * @param userId
   * @returns RoomResponseDto Group rooms joined by user
   * @throws ApiError
   */
  public static socialControllerGetRoomGroupJoinedByUserId(
    userId: number
  ): CancelablePromise<Array<RoomResponseDto>> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/social/group/user/{userId}/joined",
      path: {
        userId: userId,
      },
    });
  }
  /**
   * @returns RoomResponseDto All group rooms
   * @throws ApiError
   */
  public static socialControllerGetRoomGroupAll(): CancelablePromise<
    Array<RoomResponseDto>
  > {
    return __request(OpenAPI, {
      method: "GET",
      url: "/social/group/all",
    });
  }
  /**
   * @param userId
   * @returns RoomResponseDto Community rooms joined by user
   * @throws ApiError
   */
  public static socialControllerGetRoomCommunityJoinedByUserId(
    userId: number
  ): CancelablePromise<Array<RoomResponseDto>> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/social/community/user/{userId}/joined",
      path: {
        userId: userId,
      },
    });
  }
  /**
   * @returns RoomResponseDto All community rooms
   * @throws ApiError
   */
  public static socialControllerGetRoomCommunityAll(): CancelablePromise<
    Array<RoomResponseDto>
  > {
    return __request(OpenAPI, {
      method: "GET",
      url: "/social/community/all",
    });
  }
}
