import { CommentParentComponent } from "../CommentComponent/CommentParentComponent";
import type { UserProfile } from "../models/UserProfile";
import { ProfilePicture } from "../ProfilePicture";

interface HeaderContentComponentProps {
  creator: UserProfile;
  title: string;
  description: string;
  views: number;
  content_id: number;
  followed: boolean;
  onFollowClick: () => void;
  isOwnContent?: boolean;
  replyingTo: number | null;
  onReplySelect?: (commentId: number, commentText: string) => void;
  refresh: boolean;
}

export function HeaderContentComponent({
  creator,
  title,
  views,
  content_id,
  followed,
  description,
  onFollowClick,
  isOwnContent,
  replyingTo,
  onReplySelect,
  refresh,
}: HeaderContentComponentProps) {
  return (
    <div className="flex-1 overflow-y-auto p-4 border-b border-dark-700 space-y-4">
      <div className="flex items-center gap-3">
        <ProfilePicture
          creator={{
            profile_picture_url: creator.profile_picture_url,
            username: creator.username,
            user_id: creator.user_id,
          }}
          size="md"
          clickable={true}
        />
        <div className="flex-1">
          <p className="font-semibold text-white text-sm">
            {creator ? creator.username : `@anonymous`}
          </p>
          <p className="text-xs text-gray-400">{views} views</p>
        </div>
        <button
          onClick={onFollowClick}
          disabled={isOwnContent}
          className={`px-3 py-1 rounded-full text-xs font-medium transition-all whitespace-nowrap hover:fill-red-400 hover:text-red-400  ${
            isOwnContent
              ? "bg-gray-700 text-gray-500 cursor-not-allowed opacity-50"
              : followed
              ? "bg-dark-700 text-gray-300 hover:bg-dark-600"
              : "bg-burgundy-600 text-white hover:bg-burgundy-700"
          }`}
        >
          {isOwnContent ? "Your Content" : followed ? "Following" : "Follow"}
        </button>
      </div>

      <h2 className="font-semibold text-white text-sm">{title}</h2>

      <p className="text-gray-300 text-xs leading-relaxed">{description}</p>

      {/* Comments */}
      <div className="space-y-3">
        <CommentParentComponent
          refresh={refresh}
          contentId={content_id}
          replyingTo={replyingTo}
          onReplySelect={onReplySelect}
        />
      </div>
    </div>
  );
}
