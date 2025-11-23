/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { LogReq } from '../models/LogReq';
import type { UserLog } from '../models/UserLog';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class LogService {
    /**
     * @param date
     * @returns UserLog
     * @throws ApiError
     */
    public static logControllerFindByDate(
        date: string,
    ): CancelablePromise<Array<UserLog>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/log/date',
            query: {
                'date': date,
            },
        });
    }
    /**
     * @param id
     * @param requestBody
     * @returns any
     * @throws ApiError
     */
    public static logControllerCreate(
        id: number,
        requestBody: LogReq,
    ): CancelablePromise<Record<string, any>> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/log/{id}',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param id
     * @returns UserLog
     * @throws ApiError
     */
    public static logControllerFindOne(
        id: number,
    ): CancelablePromise<Array<UserLog>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/log/{id}',
            path: {
                'id': id,
            },
        });
    }
    /**
     * @returns UserLog
     * @throws ApiError
     */
    public static logControllerFindAll(): CancelablePromise<Array<UserLog>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/log',
        });
    }
    /**
     * @param date
     * @returns number
     * @throws ApiError
     */
    public static logControllerRemoveBefore(
        date: string,
    ): CancelablePromise<number> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/log/before',
            query: {
                'date': date,
            },
        });
    }
}
