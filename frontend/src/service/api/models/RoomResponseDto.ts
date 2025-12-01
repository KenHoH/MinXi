/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type RoomResponseDto = {
    /**
     * Room ID
     */
    id: string;
    /**
     * Room name
     */
    name?: string;
    /**
     * Room type
     */
    type: RoomResponseDto.type;
    /**
     * Creation timestamp
     */
    createdAt: string;
    /**
     * Last update timestamp
     */
    updatedAt: string;
    pictureUrl: string;
};
export namespace RoomResponseDto {
    /**
     * Room type
     */
    export enum type {
        DIRECT = 'DIRECT',
        GROUP = 'GROUP',
        COMMUNITY = 'COMMUNITY',
    }
}

