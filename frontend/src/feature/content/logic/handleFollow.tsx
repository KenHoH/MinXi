import type { NotifType } from "@/shared/logic/useNotificatoin";

export default async function handleFollow(
  delta: boolean,
  creatorId: number,
  userId: number,
  username: string,
  createFollow: (creatorId: number, userId: number) => Promise<any>,
  deleteFollow: (creatorId: number, userId: number) => Promise<any>,
  updateFollowUser: (userId: number, data: { delta: number }) => Promise<any>,
  sendNotification: (
    recipientId: number,
    senderId: number,
    message: string,
    title: string,
    type: NotifType
  ) => Promise<void>
) {
  if (delta == false) {
    await Promise.all([
      createFollow(creatorId, userId),
      updateFollowUser(creatorId, { delta: 1 }),
    ]);

    sendNotification(
      creatorId,
      userId,
      `${username || "someone"} started following you!`,
      "New Follower",
      "FOLLOW"
    );
  } else {
    await Promise.all([
      deleteFollow(creatorId, userId),
      updateFollowUser(creatorId, { delta: -1 }),
    ]);
  }
}
