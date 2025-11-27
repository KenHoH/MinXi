export default interface ContentFile {
  id: string;
  file: File;
  name: string;
  type: "image" | "video";
}
