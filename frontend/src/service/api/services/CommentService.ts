/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CommentReq } from '../models/CommentReq';
import type { CommentRes } from '../models/CommentRes';
import type { DeleteCommentRes } from '../models/DeleteCommentRes';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class CommentService {
    /**
     * @param requestBody
     * @returns CommentRes
     * @throws ApiError
     */
    public static commentControllerCreate(
        requestBody: CommentReq,
    ): CancelablePromise<CommentRes> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/comment',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param contentId
     * @returns CommentRes
     * @throws ApiError
     */
    public static commentControllerGetComment(
        contentId: number,
    ): CancelablePromise<Array<CommentRes>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/comment/{contentId}',
            path: {
                'contentId': contentId,
            },
        });
    }
    /**
     * @param commentId
     * @returns DeleteCommentRes
     * @throws ApiError
     */
    public static commentControllerDeleteComment(
        commentId: number,
    ): CancelablePromise<DeleteCommentRes> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/comment/{commentId}',
            path: {
                'commentId': commentId,
            },
        });
    }
}
