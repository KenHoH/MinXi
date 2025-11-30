/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Ack } from '../models/Ack';
import type { CreateUserDto } from '../models/CreateUserDto';
import type { CredentialRes } from '../models/CredentialRes';
import type { deltaDto } from '../models/deltaDto';
import type { NameRequest } from '../models/NameRequest';
import type { UpdateRestriction } from '../models/UpdateRestriction';
import type { UserDto } from '../models/UserDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class UserService {
    /**
     * @param requestBody
     * @returns Ack
     * @throws ApiError
     */
    public static userControllerCreate(
        requestBody: CreateUserDto,
    ): CancelablePromise<Ack> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/user',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param area
     * @returns UserDto
     * @throws ApiError
     */
    public static userControllerFindAll(
        area: number,
    ): CancelablePromise<Array<UserDto>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/user/area/{area}',
            path: {
                'area': area,
            },
        });
    }
    /**
     * @param id
     * @returns UserDto
     * @throws ApiError
     */
    public static userControllerFindOne(
        id: number,
    ): CancelablePromise<UserDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/user/user/{id}',
            path: {
                'id': id,
            },
        });
    }
    /**
     * @param formData Update profile
     * @returns UserDto
     * @throws ApiError
     */
    public static userControllerUpdate(
        formData: {
            /**
             * profile image file (required)
             */
            profile: Blob;
            /**
             * ID of the user
             */
            creator_id: number;
            /**
             * Content description
             */
            description: string;
        },
    ): CancelablePromise<UserDto> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/user/{id}/profile',
            formData: formData,
            mediaType: 'multipart/form-data',
            errors: {
                400: `Bad request - missing required files or fields`,
            },
        });
    }
    /**
     * @param id
     * @param requestBody
     * @returns Ack
     * @throws ApiError
     */
    public static userControllerUpdateLike(
        id: number,
        requestBody: deltaDto,
    ): CancelablePromise<Ack> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/user/{id}/like',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param id
     * @param requestBody
     * @returns Ack
     * @throws ApiError
     */
    public static userControllerUpdateFollow(
        id: number,
        requestBody: deltaDto,
    ): CancelablePromise<Ack> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/user/{id}/follow',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param id
     * @param requestBody
     * @returns Ack
     * @throws ApiError
     */
    public static userControllerUpdateReport(
        id: number,
        requestBody: deltaDto,
    ): CancelablePromise<Ack> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/user/{id}/report',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param id
     * @param requestBody
     * @returns Ack
     * @throws ApiError
     */
    public static userControllerUpdateRestriction(
        id: number,
        requestBody: UpdateRestriction,
    ): CancelablePromise<Ack> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/user/{id}/restriction',
            path: {
                'id': id,
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
    public static userControllerRemove(
        id: number,
    ): CancelablePromise<Ack> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/user/{id}',
            path: {
                'id': id,
            },
        });
    }
    /**
     * @param requestBody
     * @returns CredentialRes
     * @throws ApiError
     */
    public static userControllerFindByName(
        requestBody: NameRequest,
    ): CancelablePromise<CredentialRes> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/user/name',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param requestBody
     * @returns UserDto
     * @throws ApiError
     */
    public static userControllerFindOneByName(
        requestBody: NameRequest,
    ): CancelablePromise<UserDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/user/one/name',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
}
