import { ChevronLeft, ChevronRight, X } from "lucide-react";

interface MediaItem {
  type: "image" | "video";
  src: string;
}

interface ContentMediaGalleryProps {
  mediaItems: MediaItem[];
  currentMediaIndex: number;
  onPrevMedia: () => void;
  onNextMedia: () => void;
  onClose: () => void;
  title: string;
}

export function ContentMediaGallery({
  mediaItems,
  currentMediaIndex,
  onPrevMedia,
  onNextMedia,
  onClose,
  title,
}: ContentMediaGalleryProps) {
  return (
    <div className="flex-1 bg-black flex flex-col items-center justify-center relative group">
      <button
        onClick={onClose}
        className="absolute top-4 left-4 p-2 bg-black/50 rounded-full hover:bg-black/70 text-white transition-colors z-10"
      >
        <X className="w-6 h-6" />
      </button>

      {mediaItems[currentMediaIndex].type === "video" ? (
        <video
          key={`video-${currentMediaIndex}`}
          src={mediaItems[currentMediaIndex].src}
          controls
          className="w-full h-full object-cover"
        />
      ) : (
        <img
          key={`image-${currentMediaIndex}`}
          src={mediaItems[currentMediaIndex].src}
          alt={`${title} - ${currentMediaIndex + 1}`}
          className="w-full h-full object-cover"
        />
      )}

      {/* Pagination Counter */}
      {mediaItems.length > 1 && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/60 text-white px-3 py-1 rounded-full text-xs font-medium">
          {currentMediaIndex + 1} / {mediaItems.length}
        </div>
      )}

      {/* Previous Button */}
      {mediaItems.length > 1 && (
        <button
          onClick={onPrevMedia}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 p-2 bg-black/50 rounded-full hover:bg-black/70 text-white transition-all opacity-0 group-hover:opacity-100"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
      )}

      {/* Next Button */}
      {mediaItems.length > 1 && (
        <button
          onClick={onNextMedia}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 bg-black/50 rounded-full hover:bg-black/70 text-white transition-all opacity-0 group-hover:opacity-100"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      )}
    </div>
  );
}
