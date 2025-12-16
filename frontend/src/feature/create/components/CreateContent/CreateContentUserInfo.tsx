import { ProfilePicture } from "../../../content/components/ProfilePicture";
import type { UserDto } from "@/service/api";

interface CreateContentUserInfoProps {
  creator: UserDto | null;
}

export function CreateContentUserInfo({ creator }: CreateContentUserInfoProps) {
  return (
    <div className="flex items-center gap-3">
      <ProfilePicture
        creator={{
          profile_picture_url: creator?.profile_picture || "",
          username: creator?.username || "Unknown",
          user_id: creator?.user_id || 0,
        }}
        size="md"
        clickable={false}
      />
      <div>
        <p className="font-semibold text-gray-100">@{creator?.username}</p>
      </div>
    </div>
  );
}
