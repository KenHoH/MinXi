import { Masonry } from "@/shared/components/Masonry";

interface GalleryItem {
  content_id: number;
  title: string;
  type?: "image" | "video" | "post";
  thumbnail?: string;
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

  return (
    <div className="space-y-3">
      <p className="text-sm font-medium text-gray-200">{title}</p>
      <div className="max-h-96 overflow-hidden rounded-lg border border-gray-700 bg-gray-900 p-4">
        <div className="overflow-y-auto max-h-96">
          <Masonry columns={3}>
            {items.map((item) => (
              <button
                key={item.content_id}
                onClick={() => onToggleSelect(item.content_id)}
                className={`w-full rounded-lg border-2 overflow-hidden transition-all ${
                  selectedIds.includes(item.content_id)
                    ? "border-burgundy-600 ring-2 ring-burgundy-600/50"
                    : "border-gray-700 hover:border-gray-600"
                }`}
              >
                {isContentItem(item) ? (
                  <>
                    <div className="aspect-square bg-gray-700 flex items-center justify-center overflow-hidden relative">
                      <img
                        src={item.thumbnail}
                        alt={item.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            "https://via.placeholder.com/150";
                        }}
                      />
                      {selectedIds.includes(item.content_id) && (
                        <div className="absolute inset-0 bg-burgundy-600/20 flex items-center justify-center">
                          <div className="w-8 h-8 bg-burgundy-600 rounded-full flex items-center justify-center">
                            <svg
                              className="w-5 h-5 text-white"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="p-3 bg-gray-800">
                      <p className="text-xs font-medium text-gray-200 line-clamp-2 mb-1">
                        {item.title}
                      </p>
                      <p className="text-xs text-gray-400">
                        {item.type === "image" ? "Image" : "Video"}
                      </p>
                    </div>
                  </>
                ) : (
                  <div className="p-4 bg-gray-800 min-h-20 flex flex-col justify-center">
                    <p className="text-xs font-medium text-gray-200 line-clamp-3 mb-2">
                      {item.title}
                    </p>
                    <p className="text-xs text-gray-400">Post</p>
                    {selectedIds.includes(item.content_id) && (
                      <div className="mt-2 flex items-center gap-1">
                        <div className="w-4 h-4 bg-burgundy-600 rounded-full flex items-center justify-center">
                          <svg
                            className="w-3 h-3 text-white"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                        <span className="text-xs text-burgundy-400">
                          Selected
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </button>
            ))}
          </Masonry>
        </div>
      </div>
    </div>
  );
}
