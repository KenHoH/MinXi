import { useAuthContext } from "@/feature/auth/context/AuthContext";
import { ProfilePicture } from "../ProfilePicture";

interface CreatePostUserInfoProps {
  currentUserId: number;
  parentPostId?: number;
}

export function CreatePostUserInfo({
  currentUserId,
  parentPostId,
}: CreatePostUserInfoProps) {
  const { user } = useAuthContext();
  return (
    <div className="flex items-center gap-3">
      <ProfilePicture creator_id={currentUserId} size="md" clickable={false} />
      <div>
        <p className="font-semibold text-gray-100">@{user?.username}</p>
        {parentPostId && (
          <p className="text-xs text-gray-400">
            Replying to Post #{parentPostId}
          </p>
        )}
      </div>
    </div>
  );
}
