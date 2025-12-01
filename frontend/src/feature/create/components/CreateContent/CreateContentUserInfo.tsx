import { useAuthContext } from "@/feature/auth/context/AuthContext";
import { ProfilePicture } from "../../../content/components/ProfilePicture";
import type { UserDto } from "@/service/api";

interface CreateContentUserInfoProps {
  creator: UserDto | null;
}

export function CreateContentUserInfo({ creator }: CreateContentUserInfoProps) {
  return (
    <div className="flex items-center gap-3">
      <ProfilePicture creator={creator} size="md" clickable={false} />
      <div>
        <p className="font-semibold text-gray-100">@{creator?.username}</p>
      </div>
    </div>
  );
}
