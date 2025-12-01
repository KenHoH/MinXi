import type { MessageResponseDto, RoomResponseDto } from "@/service/api";

export const dummyRooms: RoomResponseDto[] = [
  {
    id: "1",
    name: "Alex Johnson",
    pictureUrl: "",
    type: "DM" as RoomResponseDto["type"],
    createdAt: "2024-10-05T09:00:00Z",
    updatedAt: "2024-10-05T09:30:00Z",
  },
  {
    id: "2",
    name: "Design Crew",
    pictureUrl: "",
    type: "GROUP" as RoomResponseDto["type"],
    createdAt: "2024-10-05T09:15:00Z",
    updatedAt: "2024-10-05T10:45:00Z",
  },
  {
    id: "3",
    name: "Photography Tips",
    pictureUrl: "",
    type: "COMMUNITY" as RoomResponseDto["type"],
    createdAt: "2024-10-01T12:00:00Z",
    updatedAt: "2024-10-02T15:30:00Z",
  },
  {
    id: "4",
    name: "Sarah Smith",
    pictureUrl: "",
    type: "DM" as RoomResponseDto["type"],
    createdAt: "2024-10-05T09:00:00Z",
    updatedAt: "2024-10-05T09:30:00Z",
  },
];

export const dummyMessages: MessageResponseDto[] = [
  {
    id: "msg-1",
    roomId: "1",
    authorId: 101,
    content: "Hey! How are you?",
    type: "text",
    createdAt: "2024-12-01T10:30:00Z",
  },
  {
    id: "msg-2",
    roomId: "1",
    authorId: 102,
    content: "I'm doing great! How about you?",
    type: "text",
    createdAt: "2024-12-01T10:32:00Z",
  },
  {
    id: "msg-3",
    roomId: "1",
    authorId: 101,
    content: "All good! Just finished a project",
    type: "text",
    createdAt: "2024-12-01T10:35:00Z",
  },
  {
    id: "msg-4",
    roomId: "1",
    authorId: 102,
    content: "That's awesome! Would love to see it",
    type: "text",
    createdAt: "2024-12-01T10:37:00Z",
  },
  {
    id: "msg-5",
    roomId: "1",
    authorId: 101,
    content: "Check out this design",
    type: "image",
    mediaUrl: "https://example.com/design.png",
    createdAt: "2024-12-01T10:40:00Z",
  },
];
