import { ChevronRight, Heart, MessageCircle, Pin } from "lucide-react";
import type { FullContentDto } from "@/service/api";

interface MiniPostDetailProps {
  post: FullContentDto;
  onPostClick?: (post: FullContentDto) => void;
}

export function MiniPostDetail({ post, onPostClick }: MiniPostDetailProps) {
  const thumbnail = post.contents?.[0];

  return (
    <div
      onClick={() => onPostClick?.(post)}
      className="flex gap-3 p-3 bg-dark-700 rounded-lg hover:bg-dark-600 transition-colors cursor-pointer border border-dark-600 hover:border-burgundy-600"
    >
      {/* Thumbnail */}
      {thumbnail ? (
        <div className="w-16 h-16 rounded-md overflow-hidden flex-shrink-0 bg-dark-800">
          <img
            src={thumbnail.filepath}
            alt={post.title}
            className="w-full h-full object-cover"
          />
          
        </div>
      ) : null}

      <div className="flex-1 min-w-0 flex flex-col justify-between">
        <div>
          <h4 className="text-xs font-semibold text-white truncate">
            {post.title}
          </h4>
          <p className="text-xs text-gray-400 line-clamp-2">
            {post.description}
          </p>
        </div>

        <div className="flex gap-3 text-xs text-gray-500">
          <span>
            <Heart
              className={`w-6 h-6 ${"text-burgundy-500 fill-burgundy-500 fill-red-500"}`}
            />
            {post.likes}
          </span>
          <span>
            <MessageCircle className="w-6 h-6 group-hover:text-burgundy-400" />
            {post.comments}
          </span>
          <span>
            <Pin className={`w-6 h-6 ${"text-yellow-500 fill-yellow-500"}`} />
            {post.pins}
          </span>
        </div>
      </div>

      <div className="flex-shrink-0 flex items-center">
        <ChevronRight size={16} className="text-burgundy-500" />
      </div>
    </div>
  );
}
