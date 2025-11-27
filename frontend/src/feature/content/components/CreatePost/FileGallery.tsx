import { Trash2, Image, Video } from "lucide-react";

interface FileItem {
  id: string;
  name: string;
  type: "image" | "video";
}

interface FileGalleryProps {
  files: FileItem[];
  onRemove: (id: string) => void;
}

export function FileGallery({ files, onRemove }: FileGalleryProps) {
  if (files.length === 0) {
    return null;
  }

  return (
    <div className="space-y-2">
      <p className="text-sm font-medium text-gray-300">
        Attached Files ({files.length})
      </p>
      <div className="space-y-2 bg-dark-700 rounded-lg p-3 max-h-64 overflow-y-auto">
        {files.map((file) => (
          <div
            key={file.id}
            className="flex items-center justify-between p-2 bg-dark-700 rounded hover:bg-dark-600 transition-colors group"
          >
            <div className="flex items-center gap-3 flex-1 min-w-0">
              {file.type === "image" ? (
                <Image className="w-4 h-4 text-burgundy-400 shrink-0" />
              ) : (
                <Video className="w-4 h-4 text-blue-400 shrink-0" />
              )}
              <div className="min-w-0 flex-1">
                <p className="text-sm text-gray-300 truncate">{file.name}</p>
                <p className="text-xs text-gray-500">
                  {file.type === "image" ? "Image" : "Video"}
                </p>
              </div>
            </div>
            <button
              onClick={() => onRemove(file.id)}
              className="ml-2 p-1 text-gray-400 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
              title="Remove file"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
