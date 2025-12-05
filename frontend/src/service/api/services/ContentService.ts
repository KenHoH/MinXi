/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Ack } from '../models/Ack';
import type { deltaDto } from '../models/deltaDto';
import type { FullContentDto } from '../models/FullContentDto';
import type { PageContentRes } from '../models/PageContentRes';
import type { UpdateScoreDto } from '../models/UpdateScoreDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ContentService {
    /**
     * @param formData Create content with thumbnail and file uploads
     * @returns FullContentDto Content created successfully
     * @throws ApiError
     */
    public static contentControllerCreate(
        formData: {
            /**
             * Thumbnail image file (required for content creation)
             */
            thumbnail?: Blob;
            /**
             * Content files - images or videos (1-5 files required)
             */
            contents?: Array<Blob>;
            /**
             * ID of the content creator
             */
            creator_id: number;
            /**
             * Area ID (1-3)
             */
            area_id: number;
            /**
             * Type of post
             */
            post_type: string;
            /**
             * Content title
             */
            title: string;
            /**
             * Content description
             */
            description: string;
            /**
             * Visibility of the content (private or not)
             */
            visibilityPrivate?: boolean;
            /**
             * Parent content ID (optional)
             */
            parent_id?: number;
            /**
             * Publication date in ISO format
             */
            published_at: string;
        },
    ): CancelablePromise<FullContentDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/content',
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
    public static contentControllerUpdateScore(
        requestBody: UpdateScoreDto,
    ): CancelablePromise<Ack> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/content/updateScore',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param creatorId
     * @returns FullContentDto
     * @throws ApiError
     */
    public static contentControllerGetByUser(
        creatorId: number,
    ): CancelablePromise<Array<FullContentDto>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/content/user/{creator_id}',
            path: {
                'creator_id': creatorId,
            },
        });
    }
    /**
     * @param parentId
     * @returns FullContentDto
     * @throws ApiError
     */
    public static contentControllerGetChildPost(
        parentId: number,
    ): CancelablePromise<Array<FullContentDto>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/content/childpost/{parent_id}',
            path: {
                'parent_id': parentId,
            },
        });
    }
    /**
     * @param creatorId
     * @returns FullContentDto Get all content by user (including private)
     * @throws ApiError
     */
    public static contentControllerGetByUserAll(
        creatorId: number,
    ): CancelablePromise<Array<FullContentDto>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/content/user/{creator_id}/all',
            path: {
                'creator_id': creatorId,
            },
        });
    }
    /**
     * @param creatorId
     * @returns FullContentDto Get all content by user (including private)
     * @throws ApiError
     */
    public static contentControllerGetByUserAllPublic(
        creatorId: number,
    ): CancelablePromise<Array<FullContentDto>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/content/user/{creator_id}/all/public',
            path: {
                'creator_id': creatorId,
            },
        });
    }
    /**
     * @returns FullContentDto
     * @throws ApiError
     */
    public static contentControllerFindGlobalAll(): CancelablePromise<Array<FullContentDto>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/content/global',
        });
    }
    /**
     * @param areaId
     * @param cursor
     * @param limit
     * @returns PageContentRes
     * @throws ApiError
     */
    public static contentControllerFindAllGlobalPage(
        areaId: number,
        cursor: number,
        limit: number,
    ): CancelablePromise<PageContentRes> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/content/global/page',
            query: {
                'area_id': areaId,
                'cursor': cursor,
                'limit': limit,
            },
        });
    }
    /**
     * @param userId
     * @param areaId
     * @param page
     * @returns PageContentRes
     * @throws ApiError
     */
    public static contentControllerGetFollowingContent(
        userId: number,
        areaId: number,
        page: number,
    ): CancelablePromise<PageContentRes> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/content/user/{userId}/{areaId}/{page}/following',
            path: {
                'userId': userId,
                'areaId': areaId,
                'page': page,
            },
        });
    }
    /**
     * @param userId
     * @param areaId
     * @param page
     * @returns PageContentRes
     * @throws ApiError
     */
    public static contentControllerGetFriendContent(
        userId: number,
        areaId: number,
        page: number,
    ): CancelablePromise<PageContentRes> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/content/user/{userId}/{areaId}/{page}/friends',
            path: {
                'userId': userId,
                'areaId': areaId,
                'page': page,
            },
        });
    }
    /**
     * @param userId
     * @returns FullContentDto
     * @throws ApiError
     */
    public static contentControllerGetLikedByUser(
        userId: number,
    ): CancelablePromise<Array<FullContentDto>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/content/user/{userId}/liked',
            path: {
                'userId': userId,
            },
        });
    }
    /**
     * @param userId
     * @returns FullContentDto
     * @throws ApiError
     */
    public static contentControllerGetPinnedByUser(
        userId: number,
    ): CancelablePromise<Array<FullContentDto>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/content/user/{userId}/pinned',
            path: {
                'userId': userId,
            },
        });
    }
    /**
     * @param contentId
     * @param areaId
     * @returns FullContentDto
     * @throws ApiError
     */
    public static contentControllerGetAncestorPost(
        contentId: number,
        areaId: number,
    ): CancelablePromise<Array<FullContentDto>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/content/{content_id}/{area_id}/ancestorPost',
            path: {
                'content_id': contentId,
                'area_id': areaId,
            },
        });
    }
    /**
     * @param contentId
     * @param areaId
     * @returns FullContentDto
     * @throws ApiError
     */
    public static contentControllerGetFullPost(
        contentId: number,
        areaId: number,
    ): CancelablePromise<FullContentDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/content/{content_id}/{area_id}/fullPost',
            path: {
                'content_id': contentId,
                'area_id': areaId,
            },
        });
    }
    /**
     * @param areaId
     * @returns FullContentDto
     * @throws ApiError
     */
    public static contentControllerFindAll(
        areaId: number,
    ): CancelablePromise<Array<FullContentDto>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/content/{area_id}',
            path: {
                'area_id': areaId,
            },
        });
    }
    /**
     * @param contentId
     * @param areaId
     * @returns FullContentDto
     * @throws ApiError
     */
    public static contentControllerFindOne(
        contentId: number,
        areaId: number,
    ): CancelablePromise<FullContentDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/content/{content_id}/{area_id}',
            path: {
                'content_id': contentId,
                'area_id': areaId,
            },
        });
    }
    /**
     * @param contentId
     * @param areaId
     * @returns Ack
     * @throws ApiError
     */
    public static contentControllerRemove(
        contentId: number,
        areaId: number,
    ): CancelablePromise<Ack> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/content/{content_id}/{area_id}',
            path: {
                'content_id': contentId,
                'area_id': areaId,
            },
        });
    }
    /**
     * @param areaId
     * @param page
     * @param limit
     * @returns PageContentRes
     * @throws ApiError
     */
    public static contentControllerFindAllPage(
        areaId: number,
        page: number,
        limit: number,
    ): CancelablePromise<PageContentRes> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/content/{area_id}/{page}/{limit}',
            path: {
                'area_id': areaId,
                'page': page,
                'limit': limit,
            },
        });
    }
    /**
     * @param creatorId
     * @param isPrivate
     * @returns number
     * @throws ApiError
     */
    public static contentControllerSetUserContentPrivacy(
        creatorId: number,
        isPrivate: boolean,
    ): CancelablePromise<number> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/content/{creator_id}/content/{isPrivate}',
            path: {
                'creator_id': creatorId,
                'isPrivate': isPrivate,
            },
        });
    }
    /**
     * @param contentId
     * @param areaId
     * @param requestBody
     * @returns Ack
     * @throws ApiError
     */
    public static contentControllerUpdateView(
        contentId: number,
        areaId: number,
        requestBody: deltaDto,
    ): CancelablePromise<Ack> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/content/{content_id}/{area_id}/view',
            path: {
                'content_id': contentId,
                'area_id': areaId,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param contentId
     * @param areaId
     * @param requestBody
     * @returns Ack
     * @throws ApiError
     */
    public static contentControllerUpdateLike(
        contentId: number,
        areaId: number,
        requestBody: deltaDto,
    ): CancelablePromise<Ack> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/content/{content_id}/{area_id}/like',
            path: {
                'content_id': contentId,
                'area_id': areaId,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param contentId
     * @param areaId
     * @param requestBody
     * @returns Ack
     * @throws ApiError
     */
    public static contentControllerUpdatePin(
        contentId: number,
        areaId: number,
        requestBody: deltaDto,
    ): CancelablePromise<Ack> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/content/{content_id}/{area_id}/pin',
            path: {
                'content_id': contentId,
                'area_id': areaId,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param contentId
     * @param areaId
     * @param requestBody
     * @returns Ack
     * @throws ApiError
     */
    public static contentControllerUpdateComment(
        contentId: number,
        areaId: number,
        requestBody: deltaDto,
    ): CancelablePromise<Ack> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/content/{content_id}/{area_id}/comment',
            path: {
                'content_id': contentId,
                'area_id': areaId,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param contentId
     * @param areaId
     * @param requestBody
     * @returns Ack
     * @throws ApiError
     */
    public static contentControllerUpdateReport(
        contentId: number,
        areaId: number,
        requestBody: deltaDto,
    ): CancelablePromise<Ack> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/content/{content_id}/{area_id}/report',
            path: {
                'content_id': contentId,
                'area_id': areaId,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
}
