import { Check, Image, Video } from "lucide-react";
import type { FileDto } from "@/service/api";

interface GalleryItem {
  content_id: number;
  title: string;
  type?: "image" | "video" | "post";
  thumbnail?: FileDto;
}

interface MasonrySelectorProps {
  title: string;
  items: GalleryItem[];
  selectedIds: number[];
  onToggleSelect: (id: number) => void;
}

export function MasonrySelector({
  title,
  items,
  selectedIds,
  onToggleSelect,
}: MasonrySelectorProps) {
  const isContentItem = (item: GalleryItem): boolean => {
    return item.type === "image" || item.type === "video";
  };

  const getTypeIcon = (type?: string) => {
    if (type === "image")
      return <Image className="w-4 h-4 text-burgundy-400" />;
    if (type === "video") return <Video className="w-4 h-4 text-blue-400" />;
    return null;
  };

  const getTypeLabel = (type?: string) => {
    if (type === "image") return "Image";
    if (type === "video") return "Video";
    return "Post";
  };

  return (
    <div className="space-y-3">
      <p className="text-sm font-medium text-gray-200">{title}</p>
      <div className="rounded-lg border border-dark-700 bg-dark-750 p-5">
        <div className="grid grid-cols-4 gap-10 p-5">
          {items.map((item) => (
            <button
              key={item.content_id}
              onClick={() => onToggleSelect(item.content_id)}
              className={`rounded border-2 overflow-hidden transition-all flex flex-col h-32 w-50 ${
                selectedIds.includes(item.content_id)
                  ? "border-burgundy-600 ring-2 ring-burgundy-600/50"
                  : "border-dark-600 hover:border-dark-500"
              }`}
            >
              {/* Thumbnail - Always Show for Image/Video, Rectangle for Post */}
              <div className="flex-1 bg-dark-700 flex items-center justify-center overflow-hidden relative">
                {isContentItem(item) ? (
                  <>
                    <img
                      src={item.thumbnail?.filepath}
                      alt={item.title}
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = "none";
                      }}
                    />
                    {selectedIds.includes(item.content_id) && (
                      <div className="absolute inset-0 bg-burgundy-600/30 flex items-center justify-center">
                        <div className="w-6 h-6 bg-burgundy-600 rounded-full flex items-center justify-center">
                          <Check className="w-4 h-4 text-white" />
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="w-full h-full bg-dark-600 flex items-center justify-center">
                    {selectedIds.includes(item.content_id) && (
                      <div className="w-6 h-6 bg-burgundy-600 rounded-full flex items-center justify-center">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Info Footer */}
              <div className="p-1 bg-dark-800">
                <p className="text-xs font-medium text-gray-100 line-clamp-1">
                  {item.title}
                </p>
                <div className="flex items-center gap-1 text-xs">
                  {getTypeIcon(item.type)}
                  <span className="text-xs text-gray-400">
                    {getTypeLabel(item.type)}
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
