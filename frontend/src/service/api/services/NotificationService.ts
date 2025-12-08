/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { DeleteNotificationRes } from "../models/DeleteNotificationRes";
import type { NotificationReq } from "../models/NotificationReq";
import type { NotificationRes } from "../models/NotificationRes";
import type { CancelablePromise } from "../core/CancelablePromise";
import { OpenAPI } from "../core/OpenAPI";
import { request as __request } from "../core/request";
export class NotificationService {
  /**
   * @param requestBody
   * @returns NotificationRes
   * @throws ApiError
   */
  public static notificationControllerCreate(
    requestBody: NotificationReq
  ): CancelablePromise<NotificationRes> {
    return __request(OpenAPI, {
      method: "POST",
      url: "/notification",
      body: requestBody,
      mediaType: "application/json",
    });
  }
  /**
   * @param userId
   * @returns NotificationRes
   * @throws ApiError
   */
  public static notificationControllerGetNotif(
    userId: number
  ): CancelablePromise<Array<NotificationRes>> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/notification/{userId}",
      path: {
        userId: userId,
      },
    });
  }
  /**
   * @param notificationId
   * @returns DeleteNotificationRes
   * @throws ApiError
   */
  public static notificationControllerRemove(
    notificationId: number
  ): CancelablePromise<number> {
    return __request(OpenAPI, {
      method: "DELETE",
      url: "/notification/{notificationId}",
      path: {
        notificationId: notificationId,
      },
    });
  }
}
