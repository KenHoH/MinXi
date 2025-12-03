/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { FileDto } from "./FileDto";
export type FullContentDto = {
  content_id: number;
  creator_id: number;
  parent_id?: number;
  area_id: number;
  thumbnail: FileDto | null;
  contents: Array<FileDto>;
  title: string;
  description: string;
  post_type: string;
  visibilityPrivate: boolean;
  views: number;
  likes: number;
  comments: number;
  pins: number;
  reports: number;
  published_at: string;
  score: number;
  username: string;
  profile_url: string;
};
