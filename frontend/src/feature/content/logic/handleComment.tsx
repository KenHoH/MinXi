import type { NotifType } from "@/shared/logic/useNotificatoin";

const handleComment = async (
  contentId: number,
  userId: number,
  creatorId: number,
  areaId: number,
  totalComments: number,
  setTotalComments: (count: number) => void,
  onCommentClick: (newCount: number) => void,
  updateComment: (
    contentId: number,
    areaId: number,
    data: { delta: number }
  ) => Promise<any>,
  sendNotification: (
    recipientId: number,
    senderId: number,
    message: string,
    title: string,
    type: NotifType
  ) => void
) => {
  await updateComment(contentId, areaId, {
    delta: 1,
  });
  const newCommentCount = totalComments + 1;
  setTotalComments(newCommentCount);
  onCommentClick(newCommentCount);
  if (userId !== creatorId) {
    sendNotification(
      creatorId,
      userId,
      `Your post received a new comment! from ${userId || "someone"}`,
      "New Comment",
      "COMMENT"
    );
  }
};

export default handleComment;
