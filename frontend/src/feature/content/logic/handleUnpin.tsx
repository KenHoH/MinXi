import type { FullContentDto } from "@/service/api";
import type { ToastType } from "@/shared/context/ToastContext";

export const handleUnpin = async (
  content: FullContentDto,
  userId: number,
  areaId: number,
  pinnedBoardId: number | null,
  liked: boolean,
  setTotalPins: React.Dispatch<React.SetStateAction<number>>,
  setPinned: React.Dispatch<React.SetStateAction<boolean>>,
  setPinnedBoardId: React.Dispatch<React.SetStateAction<number | null>>,
  onPinClick: (newPinCount: number) => void,
  onPinned: (pinned: boolean) => void,
  removeContent: (
    boardId: number,
    areaId: number,
    data: { content_id: number }
  ) => Promise<any>,
  updatePin: (
    contentId: number,
    areaId: number,
    data: { delta: number }
  ) => Promise<any>,
  upsertHistory: (data: any) => Promise<any>,
  showToast: (message: string, description?: string, type?: ToastType) => void
) => {
  if (pinnedBoardId === null) return;

  try {
    await removeContent(pinnedBoardId, areaId, {
      content_id: content.content_id,
    });

    await updatePin(content.content_id, areaId, {
      delta: -1,
    });

    const newPinCount = await new Promise<number>((resolve) => {
      setTotalPins((prev) => {
        resolve(prev - 1);
        return prev - 1;
      });
    });
    setPinned(false);
    setPinnedBoardId(null);

    await upsertHistory({
      content_id: content.content_id,
      user_id: userId,
      liked,
      pinned: false,
      reps: 0,
    });

    onPinClick(newPinCount);
    onPinned(false);

    showToast("Content unpinned successfully", "", "success");
  } catch (error) {
    console.error("Failed to unpin content:", error);
    showToast("Failed to unpin content", "", "error");
    throw error;
  }
};
