/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Ack } from '../models/Ack';
import type { AddContentDto } from '../models/AddContentDto';
import type { BoardDto } from '../models/BoardDto';
import type { ContentIdsResDto } from '../models/ContentIdsResDto';
import type { RemoveContentDto } from '../models/RemoveContentDto';
import type { UpdateContentDto } from '../models/UpdateContentDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class BoardService {
    /**
     * @param formData Update profile
     * @returns BoardDto Board created successfully
     * @throws ApiError
     */
    public static boardControllerCreate(
        formData: {
            /**
             * thumbnail image file (required)
             */
            thumbnail: Blob;
            /**
             * ID of the user
             */
            creator_id: number;
            /**
             * ID of the area
             */
            area_id?: number;
            /**
             * Board title
             */
            title: string;
            /**
             * Board description
             */
            description: string;
            /**
             * Board visibility status
             */
            visibility: boolean;
            /**
             * Content ids
             */
            contents?: Array<number>;
        },
    ): CancelablePromise<BoardDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/board',
            formData: formData,
            mediaType: 'multipart/form-data',
            errors: {
                400: `Bad request - missing required files or fields`,
            },
        });
    }
    /**
     * @param boardId
     * @param areaId
     * @param requestBody
     * @returns Ack
     * @throws ApiError
     */
    public static boardControllerAddContent(
        boardId: number,
        areaId: number,
        requestBody: AddContentDto,
    ): CancelablePromise<Ack> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/board/{boardId}/{area_id}/content',
            path: {
                'boardId': boardId,
                'area_id': areaId,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param boardId
     * @param areaId
     * @param requestBody
     * @returns Ack
     * @throws ApiError
     */
    public static boardControllerRemoveContent(
        boardId: number,
        areaId: number,
        requestBody: RemoveContentDto,
    ): CancelablePromise<Ack> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/board/{boardId}/{area_id}/content',
            path: {
                'boardId': boardId,
                'area_id': areaId,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param id
     * @returns Ack
     * @throws ApiError
     */
    public static boardControllerSetPrivate(
        id: number,
    ): CancelablePromise<Ack> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/board/{id}/private',
            path: {
                'id': id,
            },
        });
    }
    /**
     * @param id
     * @returns Ack
     * @throws ApiError
     */
    public static boardControllerSetPublic(
        id: number,
    ): CancelablePromise<Ack> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/board/{id}/public',
            path: {
                'id': id,
            },
        });
    }
    /**
     * @param boardId
     * @param areaId
     * @param requestBody
     * @returns BoardDto
     * @throws ApiError
     */
    public static boardControllerUpdateContent(
        boardId: number,
        areaId: number,
        requestBody: UpdateContentDto,
    ): CancelablePromise<BoardDto> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/board/{boardId}/{area_id}',
            path: {
                'boardId': boardId,
                'area_id': areaId,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param userId
     * @param areaId
     * @returns BoardDto
     * @throws ApiError
     */
    public static boardControllerGetBoardByUser(
        userId: number,
        areaId: number,
    ): CancelablePromise<Array<BoardDto>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/board/user/{userId}/{area_id}',
            path: {
                'userId': userId,
                'area_id': areaId,
            },
        });
    }
    /**
     * @param boardId
     * @returns ContentIdsResDto
     * @throws ApiError
     */
    public static boardControllerGetContentIdsByBoardId(
        boardId: number,
    ): CancelablePromise<ContentIdsResDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/board/{boardId}/content-ids',
            path: {
                'boardId': boardId,
            },
        });
    }
    /**
     * @param id
     * @returns Ack
     * @throws ApiError
     */
    public static boardControllerDeleteBoard(
        id: number,
    ): CancelablePromise<Ack> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/board/{id}',
            path: {
                'id': id,
            },
        });
    }
}
