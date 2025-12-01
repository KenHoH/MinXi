"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import type { FileDto } from "@/service/api";

interface PostMediaGalleryProps {
  mediaItems: FileDto[];
  currentMediaIndex: number;
  onPrevMedia: () => void;
  onNextMedia: () => void;
  title: string;
}

export function PostMediaGallery({
  mediaItems,
  currentMediaIndex,
  onPrevMedia,
  onNextMedia,
  title,
}: PostMediaGalleryProps) {
  if (mediaItems.length === 0) {
    return null;
  }

  return (
    <div className="relative bg-black rounded-lg overflow-hidden group aspect-video flex items-center justify-center">
      {mediaItems[currentMediaIndex].type === "video" ? (
        <video
          key={`video-${currentMediaIndex}`}
          src={mediaItems[currentMediaIndex].filepath}
          controls
          className="w-full h-full object-cover"
        />
      ) : (
        <img
          key={`image-${currentMediaIndex}`}
          src={mediaItems[currentMediaIndex].filepath}
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
