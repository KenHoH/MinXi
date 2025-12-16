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
};
