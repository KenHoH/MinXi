import type { FullContentDto } from "@/service/api";

/**
 * Handles the successful pin operation
 * Updates the content pin count and user history
 */
export const handlePinSuccess = async (
  boardId: number,
  content: FullContentDto,
  user: { user_id: number; area_id: number },
  liked: boolean,
  updatePin: Function,
  upsert: Function,
  setPinnedBoardId: (id: number) => void,
  setPinned: (value: boolean) => void,
  setTotalPins: (fn: (prev: number) => number) => void,
  setShowPinModal: (value: boolean) => void,
  showToast: Function
): Promise<boolean> => {
  if (!user) {
    showToast("User not found", "", "error");
    return false;
  }

  try {
    await updatePin(content.content_id, user.area_id || 0, {
      delta: 1,
    });

    await upsert({
      content_id: content.content_id,
      user_id: user.user_id,
      liked,
      pinned: true,
      reps: 0,
    });

    // Update UI state
    setPinnedBoardId(boardId);
    setPinned(true);
    setTotalPins((prev) => prev + 1);
    setShowPinModal(false);

    showToast("Content pinned successfully", "", "success");
    return true;
  } catch (error) {
    console.error("Failed to complete pin:", error);
    showToast("Failed to complete pin", "", "error");
    return false;
  }
};
