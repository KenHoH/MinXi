import { useAuthContext } from "@/feature/auth/context/AuthContext";
import useConnectionService from "@/shared/hooks/useConnectionService";
import useUserService from "@/shared/hooks/useUserService";

export default async function handleFollow(
  delta: boolean,
  creatorId: number,
  userId: number
) {
  const { user } = useAuthContext();
  if (!user) return;
  const { createFollow, deleteFollow } = useConnectionService();
  const { updateFollowUser } = useUserService();

  if (delta == false) {
    await createFollow(creatorId, userId);
    await updateFollowUser(creatorId, { delta: 1 });
  } else {
    await deleteFollow(creatorId, userId);
    await updateFollowUser(creatorId, { delta: -1 });
  }
}
