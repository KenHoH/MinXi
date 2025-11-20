/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type UpdateParticipantRoleDto = {
    /**
     * Room ID
     */
    roomId: string;
    /**
     * User ID to update
     */
    userId: number;
    /**
     * New role for the participant
     */
    newRole: UpdateParticipantRoleDto.newRole;
};
export namespace UpdateParticipantRoleDto {
    /**
     * New role for the participant
     */
    export enum newRole {
        OWNER = 'OWNER',
        ADMIN = 'ADMIN',
        MEMBER = 'MEMBER',
    }
}

