import { Trash2 } from "lucide-react";

interface ThumbnailPreviewProps {
  preview: string | null;
  fileName: string | null;
  onRemove: () => void;
}

export function ThumbnailPreview({
  preview,
  fileName,
  onRemove,
}: ThumbnailPreviewProps) {
  if (!preview) {
    return null;
  }

  return (
    <div className="space-y-2">
      <p className="text-sm font-medium text-gray-300">Board Thumbnail</p>
      <div className="relative group rounded-lg overflow-hidden bg-dark-700 w-40 h-40">
        <img
          src={preview}
          alt="board thumbnail"
          className="w-full h-full object-cover"
        />
        <button
          onClick={onRemove}
          className="absolute top-2 right-2 p-2 bg-black/60 rounded-full hover:bg-black/80 transition-colors opacity-0 group-hover:opacity-100"
          title="Remove thumbnail"
        >
          <Trash2 className="w-4 h-4 text-red-400" />
        </button>
      </div>
      <p className="text-xs text-gray-400">{fileName}</p>
    </div>
  );
}
