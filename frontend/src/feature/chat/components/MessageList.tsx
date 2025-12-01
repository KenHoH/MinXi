"use client";

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
