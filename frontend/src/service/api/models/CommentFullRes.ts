/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { UserDto } from "./UserDto";
export type CommentFullRes = {
  id: number;
  content_id: number;
  creator: UserDto;
  parent_id: number;
  text: string;
  replies: Array<CommentFullRes>;
  created_at: string;
};
