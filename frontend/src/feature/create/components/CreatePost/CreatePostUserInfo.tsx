import { useAuthContext } from "@/feature/auth/context/AuthContext";
import { ProfilePicture } from "../../../content/components/ProfilePicture";
import type { FullContentDto, UserDto } from "@/service/api";
import useContentService from "@/shared/hooks/useContentService";
import { useEffect, useState } from "react";

interface CreatePostUserInfoProps {
  parentPostId?: number;
  parentAreaId?: number;
  creator: UserDto;
}

export function CreatePostUserInfo({
  parentPostId,
  creator,
  parentAreaId,
}: CreatePostUserInfoProps) {
  const { user } = useAuthContext();
  const [parentPost, setParentPost] = useState<FullContentDto | null>(null);
  const { findOne } = useContentService();

  useEffect(() => {
    const fetchParentPost = async () => {
      if (parentPostId && parentAreaId) {
        const res = await findOne(parentPostId, parentAreaId);
        setParentPost(res);
      }
    };
    fetchParentPost();
  }, []);

  return (
    <div className="flex items-center gap-3">
      <ProfilePicture
        creator={{
          user_id: creator.user_id,
          username: creator.username,
          profile_picture_url: creator.profile_picture,
        }}
        size="md"
        clickable={false}
      />
      <div>
        <p className="font-semibold text-gray-100">@{creator.username}</p>
        {parentPostId && (
          <p className="text-xs text-gray-400">
            Replying to Post #{parentPost?.title || parentPostId}
          </p>
        )}
      </div>
    </div>
  );
}
