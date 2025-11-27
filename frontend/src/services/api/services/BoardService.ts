/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Ack } from "../models/Ack";
import type { AddContentDto } from "../models/AddContentDto";
import type { BoardDto } from "../models/BoardDto";
import type { CreateBoardDto } from "../models/CreateBoardDto";
import type { RemoveContentDto } from "../models/RemoveContentDto";
import type { UpdateContentDto } from "../models/UpdateContentDto";
import type { ContentIdsResDto } from "../models/ContentIdsResDto";
import type { CancelablePromise } from "../core/CancelablePromise";
import { OpenAPI } from "../core/OpenAPI";
import { request as __request } from "../core/request";
export class BoardService {
  /**
   * @param requestBody
   * @returns BoardDto
   * @throws ApiError
   */
  public static boardControllerCreate(
    requestBody: CreateBoardDto
  ): CancelablePromise<BoardDto> {
    return __request(OpenAPI, {
      method: "POST",
      url: "/board",
      body: requestBody,
      mediaType: "application/json",
    });
  }
  /**
   * @param id
   * @returns Ack
   * @throws ApiError
   */
  public static boardControllerSetPrivate(id: number): CancelablePromise<Ack> {
    return __request(OpenAPI, {
      method: "PATCH",
      url: "/board/{id}/private",
      path: {
        id: id,
      },
    });
  }
  /**
   * @param id
   * @returns Ack
   * @throws ApiError
   */
  public static boardControllerSetPublic(id: number): CancelablePromise<Ack> {
    return __request(OpenAPI, {
      method: "PATCH",
      url: "/board/{id}/public",
      path: {
        id: id,
      },
    });
  }
  /**
   * @param boardId
   * @param requestBody
   * @returns Ack
   * @throws ApiError
   */
  public static boardControllerAddContent(
    boardId: number,
    requestBody: AddContentDto
  ): CancelablePromise<Ack> {
    return __request(OpenAPI, {
      method: "POST",
      url: "/board/{boardId}/content",
      path: {
        boardId: boardId,
      },
      body: requestBody,
      mediaType: "application/json",
    });
  }
  /**
   * @param boardId
   * @param requestBody
   * @returns Ack
   * @throws ApiError
   */
  public static boardControllerRemoveContent(
    boardId: number,
    requestBody: RemoveContentDto
  ): CancelablePromise<Ack> {
    return __request(OpenAPI, {
      method: "DELETE",
      url: "/board/{boardId}/content",
      path: {
        boardId: boardId,
      },
      body: requestBody,
      mediaType: "application/json",
    });
  }
  /**
   * @param boardId
   * @param requestBody
   * @returns BoardDto
   * @throws ApiError
   */
  public static boardControllerUpdateContent(
    boardId: number,
    requestBody: UpdateContentDto
  ): CancelablePromise<BoardDto> {
    return __request(OpenAPI, {
      method: "PATCH",
      url: "/board/{boardId}",
      path: {
        boardId: boardId,
      },
      body: requestBody,
      mediaType: "application/json",
    });
  }
  /**
   * @param id
   * @returns Ack
   * @throws ApiError
   */
  public static boardControllerDeleteBoard(id: number): CancelablePromise<Ack> {
    return __request(OpenAPI, {
      method: "DELETE",
      url: "/board/{id}",
      path: {
        id: id,
      },
    });
  }
  /**
   * @param userId
   * @returns BoardDto
   * @throws ApiError
   */
  public static boardControllerGetBoardByUser(
    userId: number
  ): CancelablePromise<Array<BoardDto>> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/board/user/{userId}",
      path: {
        userId: userId,
      },
    });
  }
  /**
   * @param boardId
   * @returns ContentIdsResDto
   * @throws ApiError
   */
  public static boardControllerGetContentIdsByBoardId(
    boardId: number
  ): CancelablePromise<ContentIdsResDto> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/board/{boardId}/content-ids",
      path: {
        boardId: boardId,
      },
    });
  }
}
