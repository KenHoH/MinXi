import type Metadata from "./Metadata";

export default interface Content {
  content_id: number;
  creator_id: number;
  parent_id: number | null;
  thumbnail_url: string;
  title: string;
  description: string;
  post_type: "image" | "video" | "post";
  likes: number;
  comments: number;
  views: number;
  pins: number;
  reports: number;
  area_id: number;

  metadata: Metadata[];

  visibilityPrivate: boolean;
}
