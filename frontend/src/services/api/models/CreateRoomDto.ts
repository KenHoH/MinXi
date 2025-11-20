/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type CreateRoomDto = {
    /**
     * Array of user IDs to add to the room
     */
    userIds: Array<string>;
    /**
     * Type of room to create
     */
    type: CreateRoomDto.type;
    name?: string;
    ownerId?: number;
    pictureUrl: string;
};
export namespace CreateRoomDto {
    /**
     * Type of room to create
     */
    export enum type {
        DIRECT = 'DIRECT',
        GROUP = 'GROUP',
        COMMUNITY = 'COMMUNITY',
    }
}

