import { useState } from "react";
import { MoreVertical } from "lucide-react";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import ChatHeaderPopover from "./ChatHeaderPopover";
import type {
  MessageResponseDto,
  RoomResponseDto,
  UserRoleDto,
} from "@/service/api";

interface ChatAreaProps {
  room: RoomResponseDto;
  messages: MessageResponseDto[];
  onSendMessage: (content: string, fileBlob?: Blob) => void;
  isConnected: boolean;
  loggedUserId?: number;
  members?: UserRoleDto[];
  currentUserRole?: string;
}

export default function ChatArea({
  room,
  messages,
  onSendMessage,
  isConnected,
  loggedUserId,
  members = [],
  currentUserRole = "MEMBER",
}: ChatAreaProps) {
  const [showPopover, setShowPopover] = useState(false);

  const mediaUrls = messages
    .filter(
      (msg) => msg.mediaUrl && (msg.type === "IMAGE" || msg.type === "VIDEO")
    )
    .map((msg) => msg);
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
        <button
          onClick={() => setShowPopover(true)}
          className="p-2 hover:bg-muted rounded-lg transition-colors"
        >
          <MoreVertical className="w-5 h-5 text-foreground" />
        </button>
      </div>

      <ChatHeaderPopover
        isOpen={showPopover}
        onClose={() => setShowPopover(false)}
        room={room}
        currentUserRole={currentUserRole}
        members={members}
        mediaUrls={mediaUrls}
        currentUser={loggedUserId ?? 0}
      />

      {/* Messages */}
      <MessageList messages={messages} loggedUserId={loggedUserId} />

      {/* Message Input */}
      <MessageInput onSendMessage={onSendMessage} />
    </div>
  );
}
