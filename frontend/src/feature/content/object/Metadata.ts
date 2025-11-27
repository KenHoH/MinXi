export default interface Metadata {
  file_id: number;
  content_id: number;
  content_area_id: number;

  thumbnail_url: string;
  file_url: string;
  type?: string;
}
