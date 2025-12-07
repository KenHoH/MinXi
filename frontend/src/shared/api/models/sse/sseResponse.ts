export type RoomMessage = {
  id: string;
  authorId: number;
  content: string;
  mediaUrl: string;
  createdAt: string;
  roomId: string;
  type: string; // "IMAGE" | "VIDEO" | ""
  authorName: string;
  authorProfileUrl: string;
};

export type UserNotification = {
  userId: number;
  title: string;
  description: string;
  isSeen: boolean;
  type: string;
};

export type SSEPayload = {
  type: "NEW_MESSAGE";
  data: RoomMessage | UserNotification;
};
