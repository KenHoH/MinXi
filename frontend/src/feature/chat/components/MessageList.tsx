import { useEffect, useRef } from "react";
import type { MessageResponseDto } from "@/service/api";

interface MessageListProps {
  messages: MessageResponseDto[];
  loggedUserId?: number;
}

export default function MessageList({
  messages,
  loggedUserId,
}: MessageListProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const formatTime = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateString;
    }
  };

  const isUserMessage = (authorId: number) => loggedUserId === authorId;

  // Sort messages by createdAt in ascending order (oldest first)
  const sortedMessages = [...messages].sort((a, b) => {
    const dateA = new Date(a.createdAt).getTime();
    const dateB = new Date(b.createdAt).getTime();
    return dateA - dateB;
  });

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (containerRef.current) {
      setTimeout(() => {
        containerRef.current?.scrollTo({
          top: containerRef.current.scrollHeight,
          behavior: "smooth",
        });
      }, 0);
    }
  }, [messages]);

  return (
    <div ref={containerRef} className="flex-1 overflow-y-auto p-4 space-y-3">
      {sortedMessages.map((message, index) => (
        <div
          key={`${message.id}-${index}`}
          className={`flex flex-col ${
            isUserMessage(message.authorId) ? "items-end" : "items-start"
          } gap-2`}
        >
          {/* User info (username and profile picture) - only show for other users */}
          {!isUserMessage(message.authorId) && (
            <div className="flex items-center gap-2">
              {message.authorProfileUrl && (
                <img
                  src={message.authorProfileUrl}
                  alt={message.authorName || "User"}
                  className="w-6 h-6 rounded-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src =
                      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor'%3E%3Ccircle cx='12' cy='12' r='10'/%3E%3Cpath d='M12 12c2.2 0 4-1.8 4-4s-1.8-4-4-4-4 1.8-4 4 1.8 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z'/%3E%3C/svg%3E";
                  }}
                />
              )}
              {message.authorName && (
                <span className="text-xs font-semibold text-foreground">
                  {message.authorName}
                </span>
              )}
            </div>
          )}

          {/* Render media outside message box */}
          {message.type === "IMAGE" && message.mediaUrl && (
            <img
              src={message.mediaUrl}
              alt="Message image"
              className="max-w-xs rounded-lg shadow-md"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
          )}

          {message.type === "VIDEO" && message.mediaUrl && (
            <video
              src={message.mediaUrl}
              controls
              className="max-w-xs rounded-lg shadow-md"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
          )}

          {/* Message text box */}
          <div
            className={`max-w-xs px-4 py-2 rounded-lg ${
              isUserMessage(message.authorId)
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-foreground"
            }`}
          >
            {/* Render text content */}
            {message.content && <p className="text-sm">{message.content}</p>}

            {/* Render timestamp */}
            <p
              className={`text-xs mt-1 ${
                isUserMessage(message.authorId)
                  ? "opacity-70"
                  : "text-muted-foreground"
              }`}
            >
              {formatTime(message.createdAt)}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
