import { Heart, MessageCircle, Pin } from "lucide-react";

interface ContentDetailInfoProps {
  title: string;
  likes: number;
  comments: number;
  liked: boolean;
  pinned: boolean;
  pins: number;
  creator: string;
  creatorProfile: string;
}

export function ContentDetailInfo({
  title,
  likes,
  liked,
  pinned,
  pins,
  comments,
  creator,
  creatorProfile,
}: ContentDetailInfoProps) {
  return (
    <div className="p-3 space-y-3">
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
      <h3 className="font-medium text-gray-100 truncate text-sm">{title}</h3>
      <div className="flex items-center justify-start gap-3 text-xs text-gray-400">
        <span className="flex items-center gap-1 hover:text-burgundy-400 transition-colors">
          <Heart
            className={`w-4 h-4 ${
              liked ? "fill-red-400 text-red-400" : " text-burgundy-400"
            }`}
          />
          {likes}
        </span>
        <span className="flex items-center gap-1 hover:text-burgundy-400 transition-colors">
          <MessageCircle className="w-4 h-4 " />
          {comments}
        </span>
        <span className="flex items-center gap-1 hover:text-burgundy-400 transition-colors">
          <Pin
            className={`w-4 h-4 ${
              pinned ? "fill-red-400 text-red-400 " : " text-burgundy-400"
            }`}
          />
          {pins}
        </span>
      </div>
    </div>
  );
}
