import type Content from "./PublicContent";
export default interface Board {
  board_id: number;
  thumbnail_url: string;
  creator_id: number;
  title: string;
  description: string;
  visibilityPrivate: boolean;
  created_at: string;
  contents: Content[];
}
