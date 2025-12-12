export const handlePinSuccess = async (
  contentId: number,
  userId: number,
  areaId: number,
  liked: boolean,
  boardId: number,
  totalPins: number,
  setPinnedBoardId: React.Dispatch<React.SetStateAction<number | null>>,
  setPinned: React.Dispatch<React.SetStateAction<boolean>>,
  setTotalPins: React.Dispatch<React.SetStateAction<number>>,
  setShowPinModal: React.Dispatch<React.SetStateAction<boolean>>,
  onPinClick: (newPinCount: number) => void,
  onPinned: (pinned: boolean) => void,
  updatePin: (
    contentId: number,
    areaId: number,
    data: { delta: number }
  ) => Promise<any>,
  upsertHistory: (data: any) => Promise<any>,
  showToast: (message: string) => void
) => {
  try {
    await Promise.all([
      updatePin(contentId, areaId, {
        delta: 1,
      }),
      upsertHistory({
        content_id: contentId,
        user_id: userId,
        liked,
        pinned: true,
        reps: 0,
      }),
    ]);

    setPinnedBoardId(boardId);
    const newPinCount = totalPins + 1;
    setPinned(true);
    setTotalPins(newPinCount);
    setShowPinModal(false);
    onPinClick(newPinCount);
    onPinned(true);
  } catch (error) {
    console.error("Failed to complete pin:", error);
    showToast("Failed to complete pin");
    throw error;
  }
};
export default handlePinSuccess;
