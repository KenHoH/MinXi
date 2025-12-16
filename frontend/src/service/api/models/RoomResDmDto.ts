/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { UserDto } from "./UserDto";
export type RoomResDmDto = {
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
  type: "DIRECT" | "GROUP" | "COMMUNITY";
  /**
   * Creation timestamp
   */
  createdAt: string;
  /**
   * Last update timestamp
   */
  updatedAt: string;
  pictureUrl: string;
  /**
   * List of participants (other users in the DM) with their details
   */
  participants: Array<UserDto>;
};
