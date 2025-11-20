/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type ParticipantResponseDto = {
    /**
     * Participant ID
     */
    id: string;
    /**
     * User ID
     */
    userId: number;
    /**
     * Room ID
     */
    roomId: string;
    /**
     * Participant role in the room
     */
    role: ParticipantResponseDto.role;
};
export namespace ParticipantResponseDto {
    /**
     * Participant role in the room
     */
    export enum role {
        OWNER = 'OWNER',
        ADMIN = 'ADMIN',
        MEMBER = 'MEMBER',
    }
}

