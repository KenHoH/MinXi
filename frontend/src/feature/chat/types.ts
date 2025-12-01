export interface Message {
  id: string;
  authorId: number;
  content: string;
  createdAt: string;
}

export interface Room {
  id: string;
  name: string;
  pictureUrl: string;
  type: "DM" | "GROUP" | "COMMUNITY";
  lastMessage: string;
}
