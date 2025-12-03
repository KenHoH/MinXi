import { useAuthContext } from "@/feature/auth/context/AuthContext";
import type { FullContentDto } from "@/service/api";
import { useToast } from "@/shared/context/ToastContext";
import useBoardService from "@/shared/hooks/useBoardService";
import useContentService from "@/shared/hooks/useContentService";
import useHistoryService from "@/shared/hooks/useHistoryService";

export const handleUnpin = async (
  content: FullContentDto,
  pinnedBoardId: number | null,
  setTotalPins: React.Dispatch<React.SetStateAction<number>>,
  setPinned: React.Dispatch<React.SetStateAction<boolean>>,
  setPinnedBoardId: React.Dispatch<React.SetStateAction<number | null>>,
  liked: boolean
) => {
  const { user } = useAuthContext();
  if (!user || !user || pinnedBoardId === null) return;

  const { removeContent } = useBoardService();
  const { updatePin } = useContentService();
  const { upsert } = useHistoryService();
  const { showToast } = useToast();

  try {
    await removeContent(pinnedBoardId, user.area_id, {
      content_id: content.content_id,
    });

    await updatePin(content.content_id, user.area_id, {
      delta: -1,
    });

    setTotalPins((prev) => prev - 1);
    setPinned(false);
    setPinnedBoardId(null);

    await upsert({
      content_id: content.content_id,
      user_id: user.user_id,
      liked,
      pinned: false,
      reps: 0,
    });

    showToast("Content unpinned successfully", "", "success");
  } catch (error) {
    console.error("Failed to unpin content:", error);
    showToast("Failed to unpin content", "", "error");
  }
};
