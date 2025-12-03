import { Heart, MessageCircle, Share2, Pin } from "lucide-react";

interface PostFooterInfoProps {
  likes: number;
  comments: number;
  pins: number;
  creator: string;
  creatorProfile: string;
  liked: boolean;
}

export function PostFooterInfo({
  likes,
  comments,
  pins,
  creator,
  creatorProfile,
  liked,
}: PostFooterInfoProps) {
  return (
    <div className="flex flex-col gap-3">
      {creator && (
        <div className="flex items-center gap-2">
          {creatorProfile && (
            <img
              src={creatorProfile}
              alt={creator}
              className="w-6 h-6 rounded-full object-cover border border-dark-600"
            />
          )}
          <span className="text-xs font-medium text-gray-300 truncate">
            {creator}
          </span>
        </div>
      )}
      <div className="flex items-center justify-between text-xs text-gray-400 pt-2 border-t border-dark-700">
        <div className="flex gap-4">
          <span className="flex items-center gap-1 hover:text-burgundy-400 transition-colors">
            <Heart className={`w-4 h-4 ${liked ? "text-burgundy-400" : "text-gray-500"}`} />
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
    </div>
  );
}
