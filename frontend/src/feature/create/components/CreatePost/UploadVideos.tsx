import { Video } from "lucide-react";
import { useRef } from "react";

interface UploadVideosProps {
  onFilesSelected: (files: File[]) => void;
}

export function UploadVideos({ onFilesSelected }: UploadVideosProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    onFilesSelected(files);
    // Reset input so same file can be selected again
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  return (
    <>
      <button
        onClick={() => inputRef.current?.click()}
        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-dark-700 border border-dark-600 rounded-lg text-gray-300 hover:border-red-400 hover:text-burgundy-400 transition-colors"
      >
        <Video className="w-5 h-5" />
        Add Videos
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="video/*"
        multiple
        className="hidden"
        onChange={handleChange}
      />
    </>
  );
}
