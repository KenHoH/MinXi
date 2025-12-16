import { Heart, MessageCircle, Reply, Pin, Flag } from "lucide-react";

interface PostDetailMainProps {
  title: string;
  description: string;
  likes: number;
  comments: number;
  liked: boolean;
  pinned: boolean;
  pins: number;
  reported: boolean;
  onLikeClick: () => void;
  onPinClick: () => void;
  onReportClick: () => void;
  onReplyClick: () => void;
}

export function PostDetailMain({
  title,
  description,
  likes,
  comments,
  liked,
  pinned,
  pins,
  reported,
  onLikeClick,
  onPinClick,
  onReportClick,
  onReplyClick,
}: PostDetailMainProps) {
  return (
    <>
      <div className="space-y-3">
        <h2 className="text-2xl font-bold text-gray-100">{title}</h2>
        <p className="text-gray-300 leading-relaxed">{description}</p>
      </div>

      <div className="flex gap-4 pt-4 border-t border-dark-700">
        <button
          onClick={onLikeClick}
          className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-dark-700 transition-colors text-gray-300 hover:text-burgundy-400"
        >
          <Heart
            className={`w-5 h-5 ${liked ? "fill-red-400 text-red-400 " : ""}`}
          />
          <span className="text-sm font-medium">{likes}</span>
        </button>

        <button className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-dark-700 transition-colors text-gray-300 hover:text-burgundy-400">
          <MessageCircle className="w-5 h-5" />
          <span className="text-sm font-medium">{comments}</span>
        </button>

        <button
          onClick={onPinClick}
          className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-dark-700 transition-colors text-gray-300 "
        >
          <Pin
            className={`w-5 h-5 ${pinned ? "fill-red-400 text-red-400" : ""}`}
          />
          <span className="text-sm font-medium">{pins}</span>
        </button>

        <button
          onClick={onReportClick}
          className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-dark-700 transition-colors text-gray-300 hover:text-red-400"
        >
          <Flag
            className={`w-5 h-5 ${reported ? "fill-red-500 text-red-500" : ""}`}
          />
        </button>

        <button
          onClick={onReplyClick}
          className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-dark-700 transition-colors text-gray-300 hover:text-burgundy-400"
        >
          <Reply className="w-5 h-5" />
        </button>
      </div>
    </>
  );
}
