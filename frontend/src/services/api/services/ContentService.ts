/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Ack } from '../models/Ack';
import type { CreateFileDto } from '../models/CreateFileDto';
import type { CreatePostDto } from '../models/CreatePostDto';
import type { deltaDto } from '../models/deltaDto';
import type { FileRes } from '../models/FileRes';
import type { FullContentDto } from '../models/FullContentDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ContentService {
    /**
     * @param requestBody
     * @returns FullContentDto
     * @throws ApiError
     */
    public static contentControllerCreate(
        requestBody: CreatePostDto,
    ): CancelablePromise<FullContentDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/content',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param requestBody
     * @returns FileRes
     * @throws ApiError
     */
    public static contentControllerCreateFile(
        requestBody: CreateFileDto,
    ): CancelablePromise<FileRes> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/content/createFile',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param formData Uploads a mandatory image and an optional second image or video.
     * @returns any
     * @throws ApiError
     */
    public static contentControllerUploadMultipleFiles(
        formData: {
            /**
             * The primary image file.
             */
            image: Blob;
            /**
             * The associated video file.
             */
            video: Blob;
        },
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/content/files',
            formData: formData,
            mediaType: 'multipart/form-data',
        });
    }
    /**
     * @param formData Uploads a single image file for profile picture.
     * @returns any
     * @throws ApiError
     */
    public static contentControllerUploadProfile(
        formData: {
            /**
             * The profile picture image file
             */
            profilePicture: Blob;
        },
    ): CancelablePromise<Record<string, any>> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/content/profile',
            formData: formData,
            mediaType: 'multipart/form-data',
        });
    }
    /**
     * @param formData Uploads a thumbnail image and a content image. Both must be image files.
     * @returns any
     * @throws ApiError
     */
    public static contentControllerUploadImageContent(
        formData: {
            /**
             * The thumbnail image file
             */
            thumbnail: Blob;
            /**
             * The content image file
             */
            contentImage: Blob;
        },
    ): CancelablePromise<Record<string, any>> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/content/image-content',
            formData: formData,
            mediaType: 'multipart/form-data',
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
     * @param userId
     * @returns FullContentDto
     * @throws ApiError
     */
    public static contentControllerGetFollowingContent(
        userId: number,
    ): CancelablePromise<Array<FullContentDto>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/content/user/{userId}/following',
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
    public static contentControllerGetFriendContent(
        userId: number,
    ): CancelablePromise<Array<FullContentDto>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/content/user/{userId}/friends',
            path: {
                'userId': userId,
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
    /**
     * @param contentId
     * @param areaId
     * @returns Ack
     * @throws ApiError
     */
    public static contentControllerSetPrivate(
        contentId: number,
        areaId: number,
    ): CancelablePromise<Ack> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/content/{content_id}/{area_id}/private',
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
    public static contentControllerSetPublic(
        contentId: number,
        areaId: number,
    ): CancelablePromise<Ack> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/content/{content_id}/{area_id}/public',
            path: {
                'content_id': contentId,
                'area_id': areaId,
            },
        });
    }
}
