import type { NotifType } from "@/shared/logic/useNotificatoin";
import type React from "react";

const handleLike = async (
  liked: boolean,
  totalLikes: number,
  pinned: boolean,
  creatorId: number,
  userId: number,
  areaId: number,
  contentId: number,
  setLiked: React.Dispatch<React.SetStateAction<boolean>>,
  setTotalLikes: React.Dispatch<React.SetStateAction<number>>,
  onLikeClick: (newLikeCount: number) => void,
  onLiked: (newLiked: boolean) => void,
  updateLike: (
    contentId: number,
    areaId: number,
    data: { delta: number }
  ) => Promise<any>,
  updateLikeUser: (userId: number, data: { delta: number }) => Promise<any>,
  upsertHistory: (data: any) => Promise<any>,
  sendNotification: (
    recipientId: number,
    senderId: number,
    message: string,
    title: string,
    type: NotifType
  ) => void
) => {
  const newLiked = !liked;
  const newLikeCount = totalLikes + (newLiked ? 1 : -1);
  setLiked(newLiked);
  setTotalLikes(newLikeCount);
  onLikeClick(newLikeCount);
  await Promise.all([
    updateLike(contentId, areaId, {
      delta: newLiked ? 1 : -1,
    }),
    updateLikeUser(creatorId, {
      delta: newLiked ? 1 : -1,
    }),
    upsertHistory({
      content_id: contentId,
      user_id: userId,
      liked: newLiked,
      pinned,
      reps: 0,
    }),
  ]);
  if (newLiked && userId !== creatorId) {
    sendNotification(
      creatorId,
      userId,
      "Your post was liked!",
      "Liked post",
      "LIKE"
    );
  }
  onLiked(newLiked);
};

export default handleLike;
