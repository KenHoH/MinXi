/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type CreateReportDto = {
    creator_id: number;
    userId: number;
    desc: string;
    type: CreateReportDto.type;
};
export namespace CreateReportDto {
    export enum type {
        ABUSE = 'Abuse',
        SPAM = 'Spam',
        MISSINFORMATION = 'Missinformation',
    }
}

