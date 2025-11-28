import { Heart, MessageCircle, Share2, Pin } from "lucide-react";

interface PostFooterInfoProps {
  likes: number;
  comments: number;
  pins: number;
}

export function PostFooterInfo({ likes, comments, pins }: PostFooterInfoProps) {
  return (
    <div className="flex items-center justify-between text-xs text-gray-400 pt-2 border-t border-dark-700 mt-auto">
      <div className="flex gap-4">
        <span className="flex items-center gap-1 hover:text-burgundy-400 transition-colors">
          <Heart
            className={`w-4 h-4 ${
              likes > 0 ? "fill-red-500 text-red-500" : "text-gray-500"
            }`}
          />
          {likes}
        </span>
        <span className="flex items-center gap-1 hover:text-burgundy-400 transition-colors">
          <MessageCircle className="w-4 h-4" /> {comments}
        </span>
        <span className="flex items-center gap-1 hover:text-yellow-400 transition-colors">
          <Pin className="w-4 h-4" /> {pins}
        </span>
      </div>
      <Share2 className="w-4 h-4 hover:text-burgundy-400 transition-colors cursor-pointer" />
    </div>
  );
}
