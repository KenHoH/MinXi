/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateHistoryDto } from "../models/CreateHistoryDto";
import type { CancelablePromise } from "../core/CancelablePromise";
import { OpenAPI } from "../core/OpenAPI";
import { request as __request } from "../core/request";
export class HistoryService {
  /**
   * @param requestBody
   * @returns CreateHistoryDto
   * @throws ApiError
   */
  public static historyControllerUpsert(
    requestBody: CreateHistoryDto
  ): CancelablePromise<CreateHistoryDto> {
    return __request(OpenAPI, {
      method: "PATCH",
      url: "/history",
      body: requestBody,
      mediaType: "application/json",
    });
  }
  /**
   * @param userId
   * @returns CreateHistoryDto
   * @throws ApiError
   */
  public static historyControllerGetByUser(
    userId: number
  ): CancelablePromise<Array<CreateHistoryDto>> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/history/{user_id}",
      path: {
        user_id: userId,
      },
    });
  }
  /**
   * @param userId
   * @param contentId
   * @returns CreateHistoryDto
   * @throws ApiError
   */
  public static historyControllerGetByUserAndContent(
    userId: number,
    contentId: number
  ): CancelablePromise<CreateHistoryDto> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/history/{user_id}/{content_id}",
      path: {
        user_id: userId,
        content_id: contentId,
      },
    });
  }
}
