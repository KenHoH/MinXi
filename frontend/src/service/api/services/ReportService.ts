/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Ack } from '../models/Ack';
import type { CreateReportDto } from '../models/CreateReportDto';
import type { ReportDto } from '../models/ReportDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ReportService {
    /**
     * @returns ReportDto
     * @throws ApiError
     */
    public static reportControllerGetAllReports(): CancelablePromise<Array<ReportDto>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/report',
        });
    }
    /**
     * @param requestBody
     * @returns Ack
     * @throws ApiError
     */
    public static reportControllerCreateReport(
        requestBody: CreateReportDto,
    ): CancelablePromise<Ack> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/report',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param userId
     * @returns ReportDto
     * @throws ApiError
     */
    public static reportControllerGetReportsByUser(
        userId: number,
    ): CancelablePromise<Array<ReportDto>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/report/user/{userId}',
            path: {
                'userId': userId,
            },
        });
    }
    /**
     * @param id
     * @returns Ack
     * @throws ApiError
     */
    public static reportControllerActivateReport(
        id: number,
    ): CancelablePromise<Ack> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/report/{id}/activate',
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
    public static reportControllerDeactivateReport(
        id: number,
    ): CancelablePromise<Ack> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/report/{id}/deactivate',
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
    public static reportControllerDeleteReport(
        id: number,
    ): CancelablePromise<Ack> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/report/{id}',
            path: {
                'id': id,
            },
        });
    }
}
