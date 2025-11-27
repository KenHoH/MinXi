import { Heart, MessageCircle, Share2 } from "lucide-react";

interface PostFooterInfoProps {
  likes: number;
  comments: number;
}

export function PostFooterInfo({ likes, comments }: PostFooterInfoProps) {
  return (
    <div className="flex items-center justify-between text-xs text-gray-400 pt-2 border-t border-dark-700 mt-auto">
      <div className="flex gap-4">
        <span className="flex items-center gap-1 hover:text-burgundy-400 transition-colors">
          <Heart className="w-4 h-4" /> {likes}
        </span>
        <span className="flex items-center gap-1 hover:text-burgundy-400 transition-colors">
          <MessageCircle className="w-4 h-4" /> {comments}
        </span>
      </div>
      <Share2 className="w-4 h-4 hover:text-burgundy-400 transition-colors cursor-pointer" />
    </div>
  );
}
