import { ProfilePicture } from "../ProfilePicture";
import type { UserProfile } from "../models/UserProfile";

interface PostDetailHeaderProps {
  creator: UserProfile;
  followed: boolean;
  onFollowClick: () => void;
  isOwnContent?: boolean;
}

export function PostDetailHeader({
  creator,
  followed,
  onFollowClick,
  isOwnContent,
}: PostDetailHeaderProps) {
  return (
    <div className="flex items-center gap-3 pb-4 border-b border-dark-700">
      <ProfilePicture creator={creator} size="md" clickable={true} />
      <div className="flex-1">
        <p className="font-semibold text-gray-100">@{creator.username}</p>
        <p className="text-xs text-gray-400">2 hours ago</p>
      </div>
      <button
        onClick={onFollowClick}
        disabled={isOwnContent}
        className={`px-4 py-1 rounded-full text-sm font-medium transition-all ${
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
  );
}
