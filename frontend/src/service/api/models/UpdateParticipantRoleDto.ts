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
  newRole: "OWNER" | "ADMIN" | "MEMBER";
};
