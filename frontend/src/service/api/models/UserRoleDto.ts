/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type UserRoleDto = {
  /**
   * User ID
   */
  user_id: number;
  /**
   * Username
   */
  username: string;
  /**
   * User description
   */
  desc: string;
  /**
   * User profile picture URL
   */
  profile_picture: string;
  /**
   * Number of followers
   */
  follower: number;
  /**
   * Total likes received
   */
  total_like: number;
  /**
   * Total reports received
   */
  total_reports: number;
  /**
   * Content visibility private
   */
  content_visibilityPrivate: boolean;
  /**
   * Pinned content visibility private
   */
  pinned_visibilityPrivate: boolean;
  /**
   * Liked content visibility private
   */
  liked_visibilityPrivate: boolean;
  /**
   * Area ID
   */
  area_id: number;
  /**
   * Liked notification disabled
   */
  liked_notification_disabled: boolean;
  /**
   * Comments notification disabled
   */
  comments_notification_disabled: boolean;
  /**
   * Followers notification disabled
   */
  followers_notification_disabled: boolean;
  /**
   * User role in the room (OWNER, ADMIN, MEMBER)
   */
  role: string;
};
