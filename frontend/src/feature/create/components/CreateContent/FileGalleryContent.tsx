import { Trash2, Image, Video } from "lucide-react";

interface FileItem {
  id: string;
  name: string;
  type: "image" | "video";
  preview?: string;
}

interface FileGalleryContentProps {
  files: FileItem[];
  onRemove: (id: string) => void;
}

export function FileGalleryContent({
  files,
  onRemove,
}: FileGalleryContentProps) {
  if (files.length === 0) {
    return null;
  }

  return (
    <div className="space-y-2">
      <p className="text-sm font-medium text-gray-300">
        Attached Files ({files.length})
      </p>
      <div className="grid grid-cols-2 gap-3 bg-dark-800 rounded-lg p-3 max-h-96 overflow-y-auto">
        {files.map((file) => (
          <div
            key={file.id}
            className="relative group bg-dark-700 rounded-lg overflow-hidden border border-dark-600 hover:border-burgundy-600 transition-all"
          >
            {/* Preview */}
            <div className="aspect-video bg-dark-900 flex items-center justify-center relative">
              {file.preview ? (
                file.type === "image" ? (
                  <img
                    src={file.preview}
                    alt={file.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <video
                    src={file.preview}
                    className="w-full h-full object-cover"
                    muted
                  />
                )
              ) : file.type === "image" ? (
                <Image className="w-8 h-8 text-gray-600" />
              ) : (
                <Video className="w-8 h-8 text-gray-600" />
              )}

              {/* Remove button overlay */}
              <button
                onClick={() => onRemove(file.id)}
                className="absolute top-2 right-2 p-2 bg-black/60 rounded-full hover:bg-black/80 transition-colors opacity-0 group-hover:opacity-100"
                title="Remove file"
              >
                <Trash2 className="w-3.5 h-3.5 text-red-400" />
              </button>
            </div>

            {/* File info */}
            <div className="p-2 bg-dark-700">
              <p className="text-xs text-gray-300 truncate">{file.name}</p>
              <p className="text-xs text-gray-500">
                {file.type === "image" ? "Image" : "Video"}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
