import { useAuthContext } from "@/feature/auth/context/AuthContext";
import { ProfilePicture } from "../../../content/components/ProfilePicture";
import type { UserDto } from "@/service/api";

interface CreatePostUserInfoProps {
  currentUserId: number;
  parentPostId?: number;
  creator: UserDto;
}

export function CreatePostUserInfo({
  currentUserId,
  parentPostId,
  creator,
}: CreatePostUserInfoProps) {
  const { user } = useAuthContext();
  return (
    <div className="flex items-center gap-3">
      <ProfilePicture creator={creator} size="md" clickable={false} />
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
