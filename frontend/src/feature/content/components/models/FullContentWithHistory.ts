import type { FileDto } from "@/service/api";

export interface FullContentWithHistoryProps {
  content_id: number;
  creator_id: number;
  username: string;
  profile_url: string;
  parent_id?: number;
  area_id: number;
  liked?: boolean;
  pinned?: boolean;
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
}
