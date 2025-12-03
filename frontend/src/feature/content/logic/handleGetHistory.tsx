import { useAuthContext } from "@/feature/auth/context/AuthContext";
import type { FullContentDto } from "@/service/api";
import useHistoryService from "@/shared/hooks/useHistoryService";

export const getHistory = async (
  content: FullContentDto,
  setLiked: React.Dispatch<React.SetStateAction<boolean>>,
  setPinned: React.Dispatch<React.SetStateAction<boolean>>
) => {
  const { getByUserAndContent } = useHistoryService();
  const { user } = useAuthContext();
  if (!user) return;
  const res = await getByUserAndContent(user.user_id, content.content_id);
  if (res) {
    setLiked(res.some((history) => history.liked));
    setPinned(res.some((history) => history.pinned));
  }
};
