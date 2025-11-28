import { Heart, MessageCircle, Share2, Flag, Pin } from "lucide-react";

interface FooterContentComponentProps {
  likes: number;
  comments: number;
  pins: number;
  reports: number;
  liked: boolean;
  pinned: boolean;
  reported: boolean;
  onLikeClick: () => void;
  onReport: () => void;
  onPin: () => void;
}

export function FooterContentComponent({
  likes,
  comments,
  pins,
  reports,
  liked,
  pinned,
  reported,
  onLikeClick,
  onReport,
  onPin,
}: FooterContentComponentProps) {
  return (
    <div className="flex items-center justify-around p-3 bg-dark-700">
      {/* Like */}
      <button
        onClick={onLikeClick}
        className="flex flex-col items-center gap-1 hover:text-burgundy-400 transition-colors group"
      >
        <Heart
          className={`w-6 h-6 ${
            liked
              ? "text-burgundy-500 fill-burgundy-500 fill-red-500"
              : "text-gray-300 group-hover:text-burgundy-400"
          }`}
        />

        <span className="text-xs text-gray-300 group-hover:text-burgundy-400">
          {likes}
        </span>
      </button>

      {/* Comment */}
      <button className="flex flex-col items-center gap-1 text-gray-300 hover:text-burgundy-400 transition-colors group">
        <MessageCircle className="w-6 h-6 group-hover:text-burgundy-400" />
        <span className="text-xs group-hover:text-burgundy-400">
          {comments}
        </span>
      </button>

      {/* Pin */}
      <button
        onClick={onPin}
        className="flex flex-col items-center gap-1 transition-colors group"
      >
        <Pin
          className={`w-6 h-6 ${
            pinned ? "text-yellow-500 fill-yellow-500" : "text-gray-300"
          }`}
        />

        <span className="text-xs text-gray-300">{pins}</span>
      </button>

      {/* Report */}
      <button
        onClick={onReport}
        disabled={reported}
        className="flex flex-col items-center gap-1 transition-colors group disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Flag
          className={`w-6 h-6 ${
            reported ? "text-red-500 fill-red-500" : "text-gray-300"
          }`}
        />

        <span className="text-xs text-gray-300">{reports}</span>
      </button>
      {/* Share */}
      <button className="flex flex-col items-center gap-1 text-gray-300 hover:text-burgundy-400 transition-colors group">
        <Share2 className="w-6 h-6 group-hover:text-burgundy-400" />
        <span className="text-xs group-hover:text-burgundy-400">Share</span>
      </button>
    </div>
  );
}
