/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Ack } from '../models/Ack';
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
     * @param formData Update profile
     * @returns Ack send message successfully
     * @throws ApiError
     */
    public static sseControllerSendBroadcast(
        formData: {
            /**
             * metadata file optional
             */
            metadata?: Blob;
            /**
             * ID of the room
             */
            room_id: string;
            /**
             * ID of the author
             */
            author_id: number;
            /**
             * Message description
             */
            message: string;
            /**
             * Author name
             */
            author_name?: string;
            /**
             * Author profile URL
             */
            author_profile_url?: string;
        },
    ): CancelablePromise<Ack> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/sse/sendBroadcastToRoom',
            formData: formData,
            mediaType: 'multipart/form-data',
            errors: {
                400: `Bad request - missing required files or fields`,
            },
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
