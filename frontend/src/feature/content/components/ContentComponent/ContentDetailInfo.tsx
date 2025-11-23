import { Heart, MessageCircle } from "lucide-react";

interface ContentDetailInfoProps {
  title: string;
  likes: number;
  comments: number;
}

export function ContentDetailInfo({
  title,
  likes,
  comments,
}: ContentDetailInfoProps) {
  return (
    <div className="p-3 space-y-2">
      <h3 className="font-medium text-gray-100 truncate text-sm">{title}</h3>
      <div className="flex items-center justify-between text-xs text-gray-400">
        <span className="flex items-center gap-1 hover:text-burgundy-400 transition-colors">
          <Heart className="w-4 h-4" /> {likes}
        </span>
        <span className="flex items-center gap-1 hover:text-burgundy-400 transition-colors">
          <MessageCircle className="w-4 h-4" />
          {comments}
        </span>
      </div>
    </div>
  );
}
