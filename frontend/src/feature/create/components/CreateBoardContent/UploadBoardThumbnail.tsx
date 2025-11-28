import { useRef } from "react";
import { Image } from "lucide-react";

interface UploadBoardThumbnailProps {
  onFileSelected: (file: File) => void;
}

export function UploadBoardThumbnail({
  onFileSelected,
}: UploadBoardThumbnailProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      onFileSelected(files[0]);
    }
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
        <Image className="w-5 h-5" />
        Upload Board Thumbnail
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleChange}
      />
    </>
  );
}
