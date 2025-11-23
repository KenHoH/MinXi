import { ProfilePicture } from "../ProfilePicture";

interface PostDetailHeaderProps {
  creator_id: number;
  followed: boolean;
  onFollowClick: () => void;
}

export function PostDetailHeader({
  creator_id,
  followed,
  onFollowClick,
}: PostDetailHeaderProps) {
  return (
    <div className="flex items-center gap-3 pb-4 border-b border-dark-700">
      <ProfilePicture creator_id={creator_id} size="md" clickable={true} />
      <div className="flex-1">
        <p className="font-semibold text-gray-100">@creator{creator_id}</p>
        <p className="text-xs text-gray-400">2 hours ago</p>
      </div>
      <button
        onClick={onFollowClick}
        className={`px-4 py-1 rounded-full text-sm font-medium transition-all ${
          followed
            ? "bg-dark-700 text-gray-300"
            : "bg-burgundy-600 text-white hover:bg-burgundy-700"
        }`}
      >
        {followed ? "Following" : "Follow"}
      </button>
    </div>
  );
}
