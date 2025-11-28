/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { FullContentDto } from './FullContentDto';
export type BoardDto = {
    board_id: number;
    board_thumbnail: string;
    creator_id: number;
    visibilityPrivate: boolean;
    title: string;
    description: string;
    contents: Array<FullContentDto>;
    created_at: string;
    updated_at: string;
};

