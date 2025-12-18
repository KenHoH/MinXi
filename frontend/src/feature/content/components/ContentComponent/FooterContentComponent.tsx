import { Heart, MessageCircle, Flag, Pin } from "lucide-react";

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
              ? "fill-red-400 text-red-400"
              : "hover:fill-red-400 hover:text-red-400 transition-colors"
          }`}
        />

        <span className="text-xs text-gray-300 group-hover:text-burgundy-400">
          {likes}
        </span>
      </button>

      <button className="flex flex-col items-center gap-1 text-gray-300 hover:text-burgundy-400 transition-colors group">
        <MessageCircle className="w-6 h-6 hover:fill-red-400 hover:text-red-400 transition-colors" />
        <span className="text-xs group-hover:text-burgundy-400">
          {comments}
        </span>
      </button>

      <button
        onClick={onPin}
        className="flex flex-col items-center gap-1 transition-colors group"
      >
        <Pin
          className={`w-6 h-6 ${
            pinned
              ? "fill-red-400 text-red-400"
              : "text-gray-300 hover:fill-red-400 hover:text-red-400 transition-colors"
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
            reported
              ? "fill-red-400 text-red-400"
              : "text-gray-300 hover:fill-red-400 hover:text-red-400 transition-colors"
          }`}
        />

        <span className="text-xs text-gray-300">{reports}</span>
      </button>
    </div>
  );
}
