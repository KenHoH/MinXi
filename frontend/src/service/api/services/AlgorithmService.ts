/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { FullContentDto } from '../models/FullContentDto';
import type { PageContentRes } from '../models/PageContentRes';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AlgorithmService {
    /**
     * @param areaId
     * @param page
     * @returns PageContentRes
     * @throws ApiError
     */
    public static algorithmControllerFindFyp(
        areaId: number,
        page: number,
    ): CancelablePromise<PageContentRes> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/algorithm/fyp',
            query: {
                'areaId': areaId,
                'page': page,
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
