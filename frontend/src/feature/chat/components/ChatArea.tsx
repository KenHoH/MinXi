import { MoreVertical } from "lucide-react";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import type { MessageResponseDto, RoomResponseDto } from "@/service/api";

interface ChatAreaProps {
  room: RoomResponseDto;
  messages: MessageResponseDto[];
  onSendMessage: (content: string, fileBlob?: Blob) => void;
  isConnected: boolean;
  loggedUserId?: number;
}

export default function ChatArea({
  room,
  messages,
  onSendMessage,
  isConnected,
  loggedUserId,
}: ChatAreaProps) {
  return (
    <div className="flex-1 flex flex-col bg-background">
      {/* Chat Header */}
      <div className="p-4 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img
            src={room.pictureUrl}
            alt={room.name}
            width={40}
            height={40}
            className="w-10 h-10 rounded-full"
          />
          <div>
            <p className="font-semibold text-foreground">{room.name}</p>
            <p className="text-xs text-muted-foreground">
              {isConnected ? "Online" : "Offline"}
            </p>
          </div>
        </div>
        <button className="p-2 hover:bg-muted rounded-lg transition-colors">
          <MoreVertical className="w-5 h-5 text-foreground" />
        </button>
      </div>

      {/* Messages */}
      <MessageList messages={messages} loggedUserId={loggedUserId} />

      {/* Message Input */}
      <MessageInput onSendMessage={onSendMessage} />
    </div>
  );
}
