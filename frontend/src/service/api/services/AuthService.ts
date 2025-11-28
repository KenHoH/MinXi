/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Ack } from '../models/Ack';
import type { LoginDto } from '../models/LoginDto';
import type { LogoutRequest } from '../models/LogoutRequest';
import type { RefreshTokenRequestDto } from '../models/RefreshTokenRequestDto';
import type { TokenResponseDto } from '../models/TokenResponseDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AuthService {
    /**
     * @param requestBody
     * @returns TokenResponseDto
     * @throws ApiError
     */
    public static authControllerLogin(
        requestBody: LoginDto,
    ): CancelablePromise<TokenResponseDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/auth',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param requestBody
     * @returns TokenResponseDto
     * @throws ApiError
     */
    public static authControllerRefresh(
        requestBody: RefreshTokenRequestDto,
    ): CancelablePromise<TokenResponseDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/auth/refresh',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param requestBody
     * @returns Ack
     * @throws ApiError
     */
    public static authControllerLogout(
        requestBody: LogoutRequest,
    ): CancelablePromise<Ack> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/auth/logout',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
}
