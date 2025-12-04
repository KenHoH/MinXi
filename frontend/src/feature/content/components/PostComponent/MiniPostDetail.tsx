import {
  ChevronRight,
  Heart,
  MessageCircle,
  Pin,
  ChevronLeft,
} from "lucide-react";
import type { FullContentDto } from "@/service/api";
import { useState, useEffect } from "react";
import type { FullContentWithHistoryProps } from "../models/FullContentWithHistory";

interface MiniPostDetailProps {
  post: FullContentWithHistoryProps;
  onRefresh?: () => void;
  onNavigate?: (post: FullContentDto) => void;
}

export function MiniPostDetail({
  post,
  onRefresh,
  onNavigate,
}: MiniPostDetailProps) {
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const mediaItems = post.contents || [];
  const currentMedia = mediaItems[currentMediaIndex];

  // Reset media index when post changes
  useEffect(() => {
    setCurrentMediaIndex(0);
  }, [post.content_id]);

  const handlePrevMedia = () => {
    setCurrentMediaIndex((prev) =>
      prev === 0 ? mediaItems.length - 1 : prev - 1
    );
  };

  const handleNextMedia = () => {
    setCurrentMediaIndex((prev) =>
      prev === mediaItems.length - 1 ? 0 : prev + 1
    );
  };

  const handleOpenDetail = () => {
    if (onNavigate) {
      onNavigate(post);
    }
  };

  return (
    <>
      <div
        onClick={handleOpenDetail}
        className="p-3 bg-dark-700 rounded-lg hover:bg-dark-600 transition-colors cursor-pointer border border-dark-600 hover:border-burgundy-600 space-y-2"
      >
        {/* Mini Media Gallery */}
        {mediaItems.length > 0 && (
          <div
            className="relative w-full bg-dark-800 rounded-md overflow-hidden"
            style={{ aspectRatio: "16/9" }}
          >
            {currentMedia.type === "video" ? (
              <video
                src={currentMedia.filepath}
                className="w-full h-full object-cover"
              />
            ) : (
              <img
                src={currentMedia.filepath}
                alt={post.title}
                className="w-full h-full object-cover"
              />
            )}

            {/* Media Controls */}
            {mediaItems.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePrevMedia();
                  }}
                  className="absolute left-1 top-1/2 -translate-y-1/2 p-1 bg-black/50 rounded hover:bg-black/70 transition-colors"
                >
                  <ChevronLeft size={14} className="text-white" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleNextMedia();
                  }}
                  className="absolute right-1 top-1/2 -translate-y-1/2 p-1 bg-black/50 rounded hover:bg-black/70 transition-colors"
                >
                  <ChevronRight size={14} className="text-white" />
                </button>

                {/* Media Indicator */}
                <div className="absolute bottom-1 right-1 bg-black/50 px-2 py-1 rounded text-xs text-white">
                  {currentMediaIndex + 1}/{mediaItems.length}
                </div>
              </>
            )}
          </div>
        )}

        {/* Content Info */}
        <div>
          <h4 className="text-xs font-semibold text-white truncate">
            {post.title}
          </h4>
          <p className="text-xs text-gray-400 line-clamp-1">
            {post.description}
          </p>
        </div>

        {/* Stats */}
        <div className="flex gap-2 text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <Heart
              className={`w-4 h-4 ${
                post.liked ? "fill-red-400 text-red-400" : "text-gray-500"
              }`}
            />
            {post.likes}
          </span>
          <span className="flex items-center gap-1">
            <MessageCircle className="w-4 h-4" />
            {post.comments}
          </span>
          <span className="flex items-center gap-1">
            <Pin
              className={`w-4 h-4 ${
                post.pinned ? "fill-red-400 text-red-400" : "text-gray-500"
              }`}
            />
            {post.pins}
          </span>
        </div>
      </div>
    </>
  );
}
