/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type AddUserToRoomDto = {
  /**
   * Room ID
   */
  roomId: string;
  /**
   * User ID to add
   */
  userId: number;
  /**
   * Role for the new participant
   */
  role?: "OWNER" | "ADMIN" | "MEMBER";
};
