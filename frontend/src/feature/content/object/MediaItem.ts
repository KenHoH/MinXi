export default interface MediaItem {
  id: string;
  file: File;
  preview: string;
  type: "image" | "video";
}
