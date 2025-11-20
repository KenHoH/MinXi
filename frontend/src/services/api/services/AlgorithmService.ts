/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { FullContentDto } from '../models/FullContentDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AlgorithmService {
    /**
     * @param userId
     * @param areaId
     * @returns FullContentDto
     * @throws ApiError
     */
    public static algorithmControllerFindFyp(
        userId: number,
        areaId: number,
    ): CancelablePromise<Array<FullContentDto>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/algorithm/fyp',
            query: {
                'userId': userId,
                'areaId': areaId,
            },
        });
    }
    /**
     * @param query
     * @param areaId
     * @returns FullContentDto
     * @throws ApiError
     */
    public static algorithmControllerSearchContent(
        query: string,
        areaId: number,
    ): CancelablePromise<Array<FullContentDto>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/algorithm/search',
            query: {
                'query': query,
                'areaId': areaId,
            },
        });
    }
}
