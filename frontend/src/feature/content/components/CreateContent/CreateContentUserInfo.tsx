import { ProfilePicture } from "../ProfilePicture";

interface CreateContentUserInfoProps {
  currentUserId: number;
}

export function CreateContentUserInfo({
  currentUserId,
}: CreateContentUserInfoProps) {
  return (
    <div className="flex items-center gap-3">
      <ProfilePicture creator_id={currentUserId} size="md" clickable={false} />
      <div>
        <p className="font-semibold text-gray-100">@creator{currentUserId}</p>
      </div>
    </div>
  );
}
