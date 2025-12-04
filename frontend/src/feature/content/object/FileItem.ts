export default interface FileItem {
  id: string;
  name: string;
  type: "image" | "video";
  preview?: string;
}
