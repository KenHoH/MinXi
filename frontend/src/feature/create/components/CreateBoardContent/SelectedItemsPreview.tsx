import { Trash2 } from "lucide-react";
import type { FileDto } from "@/service/api";

interface SelectedItem {
  content_id: number;
  title: string;
  type?: "image" | "video" | "post";
  thumbnail?: FileDto;
}

interface SelectedItemsPreviewProps {
  items: SelectedItem[];
  onRemove: (id: number) => void;
}

export function SelectedItemsPreview({
  items,
  onRemove,
}: SelectedItemsPreviewProps) {
  if (items.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3">
      <div>
        <p className="text-sm font-medium text-gray-300">
          Selected Items ({items.length})
        </p>
        <p className="text-xs text-gray-500">
          These items will be added to the board
        </p>
      </div>
      <div className="max-h-48 overflow-y-auto rounded-lg border border-dark-600 bg-dark-700 p-3">
        <div className="space-y-2">
          {items.map((item) => (
            <div
              key={item.content_id}
              className="flex items-center justify-between p-2 bg-dark-700 rounded hover:bg-dark-600 transition-colors group"
            >
              <div className="flex items-center gap-2 flex-1 min-w-0">
                {item.thumbnail && (
                  <img
                    src={item.thumbnail.filepath}
                    alt={item.title}
                    className="w-8 h-8 rounded object-cover shrink-0"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "https://via.placeholder.com/32";
                    }}
                  />
                )}
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-gray-200 truncate">{item.title}</p>
                  <p className="text-xs text-gray-500">
                    {item.type === "image"
                      ? "image"
                      : item.type === "video"
                      ? "video"
                      : "post"}
                  </p>
                </div>
              </div>
              <button
                onClick={() => onRemove(item.content_id)}
                className="ml-2 p-1 text-gray-400 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                title="Remove item"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
