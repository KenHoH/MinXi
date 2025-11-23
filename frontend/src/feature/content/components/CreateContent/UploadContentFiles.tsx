import { Image, Video } from "lucide-react";
import { useRef } from "react";

interface UploadContentFilesProps {
  contentType: "image" | "video" | null;
  onFilesSelected: (files: File[]) => void;
}

export function UploadContentFiles({
  contentType,
  onFilesSelected,
}: UploadContentFilesProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  if (!contentType) {
    return null;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    onFilesSelected(files);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  return (
    <>
      <button
        onClick={() => inputRef.current?.click()}
        className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-dark-700 border border-dark-600 rounded-lg text-gray-300 hover:border-burgundy-600 hover:text-burgundy-400 transition-colors"
      >
        {contentType === "image" ? (
          <>
            <Image className="w-5 h-5" />
            Add Images
          </>
        ) : (
          <>
            <Video className="w-5 h-5" />
            Add Videos
          </>
        )}
      </button>
      <input
        ref={inputRef}
        type="file"
        accept={contentType === "image" ? "image/*" : "video/*"}
        multiple
        className="hidden"
        onChange={handleChange}
      />
    </>
  );
}
