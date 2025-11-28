import { useAuthContext } from "@/feature/auth/context/AuthContext";
import { ProfilePicture } from "../../../content/components/ProfilePicture";

interface CreateContentUserInfoProps {
  currentUserId: number;
}

export function CreateContentUserInfo({
  currentUserId,
}: CreateContentUserInfoProps) {
  const { user } = useAuthContext();
  return (
    <div className="flex items-center gap-3">
      <ProfilePicture creator_id={currentUserId} size="md" clickable={false} />
      <div>
        <p className="font-semibold text-gray-100">@{user?.username}</p>
      </div>
    </div>
  );
}
