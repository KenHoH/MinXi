/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Ack } from '../models/Ack';
import type { BroadcastMsgReq } from '../models/BroadcastMsgReq';
import type { BroadcastNotifReq } from '../models/BroadcastNotifReq';
import type { ConnectionStatsRes } from '../models/ConnectionStatsRes';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class SseService {
    /**
     * @param roomId
     * @returns any
     * @throws ApiError
     */
    public static sseControllerSubscribeToRoom(
        roomId: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/sse/subscribe/rooms/{roomId}',
            path: {
                'roomId': roomId,
            },
        });
    }
    /**
     * @param requestBody
     * @returns Ack
     * @throws ApiError
     */
    public static sseControllerSendBroadcast(
        requestBody: BroadcastMsgReq,
    ): CancelablePromise<Ack> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/sse/sendBroadcastToRoom',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param requestBody
     * @returns Ack
     * @throws ApiError
     */
    public static sseControllerSendNotification(
        requestBody: BroadcastNotifReq,
    ): CancelablePromise<Ack> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/sse/sendNotificationToRoom',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @returns ConnectionStatsRes
     * @throws ApiError
     */
    public static sseControllerGetStats(): CancelablePromise<ConnectionStatsRes> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/sse/stats',
        });
    }
}
