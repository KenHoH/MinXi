interface ContentGalleryItem {
  content_id: number;
  title: string;
  type: "image" | "video";
  thumbnail: string;
}

interface PostGalleryItem {
  content_id: number;
  title: string;
}

interface SelectableGalleryProps {
  title: string;
  description: string;
  items: (ContentGalleryItem | PostGalleryItem)[];
  selectedIds: number[];
  onToggleSelect: (id: number) => void;
  isContentGallery?: boolean;
}

function isContentGalleryItem(item: any): item is ContentGalleryItem {
  return "type" in item && "thumbnail" in item;
}

export function SelectableGallery({
  title,
  description,
  items,
  selectedIds,
  onToggleSelect,
  isContentGallery = false,
}: SelectableGalleryProps) {
  return (
    <div className="space-y-3">
      <div>
        <p className="text-sm font-medium text-gray-300">{title}</p>
        <p className="text-xs text-gray-500">{description}</p>
      </div>
      <div className="max-h-48 overflow-y-auto rounded-lg border border-gray-700 bg-gray-900 p-2">
        <div className="grid grid-cols-4 gap-6">
          {items.map((item) => (
            <button
              key={item.content_id}
              onClick={() => onToggleSelect(item.content_id)}
              className={`p-2 rounded-lg border-2 transition-all text-left ${
                selectedIds.includes(item.content_id)
                  ? "border-burgundy-600 bg-burgundy-600/10"
                  : "border-gray-700 bg-gray-800 hover:border-gray-600"
              }`}
            >
              {isContentGallery && isContentGalleryItem(item) ? (
                <>
                  <div className="aspect-square bg-gray-700 rounded mb-1 flex items-center justify-center overflow-hidden">
                    <img
                      src={item.thumbnail}
                      alt={item.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "https://via.placeholder.com/150";
                      }}
                    />
                  </div>
                  <p className="text-xs font-medium text-gray-200 line-clamp-1 mb-1">
                    {item.title}
                  </p>
                  <p className="text-xs text-gray-400">
                    {item.type === "image" ? "Image" : "Video"}
                  </p>
                </>
              ) : (
                <div>
                  <p className="text-xs font-medium text-gray-200 line-clamp-2">
                    {item.title}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">Post</p>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
