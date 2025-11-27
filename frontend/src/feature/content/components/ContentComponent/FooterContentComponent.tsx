import { Heart, MessageCircle, Share2 } from "lucide-react";

interface FooterContentComponentProps {
  likes: number;
  comments: number;
  liked: boolean;
  onLikeClick: () => void;
}

export function FooterContentComponent({
  likes,
  comments,
  liked,
  onLikeClick,
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
              ? "fill-burgundy-500 text-burgundy-500"
              : "text-gray-300 group-hover:text-burgundy-400"
          }`}
        />
        <span className="text-xs text-gray-300 group-hover:text-burgundy-400">
          {likes + (liked ? 1 : 0)}
        </span>
      </button>

      {/* Comment */}
      <button className="flex flex-col items-center gap-1 text-gray-300 hover:text-burgundy-400 transition-colors group">
        <MessageCircle className="w-6 h-6 group-hover:text-burgundy-400" />
        <span className="text-xs group-hover:text-burgundy-400">
          {comments}
        </span>
      </button>

      {/* Share */}
      <button className="flex flex-col items-center gap-1 text-gray-300 hover:text-burgundy-400 transition-colors group">
        <Share2 className="w-6 h-6 group-hover:text-burgundy-400" />
        <span className="text-xs group-hover:text-burgundy-400">Share</span>
      </button>
    </div>
  );
}
