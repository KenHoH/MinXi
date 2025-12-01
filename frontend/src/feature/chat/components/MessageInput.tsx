"use client";

import { useState, useRef } from "react";
import { Send } from "lucide-react";

interface MessageInputProps {
  onSendMessage: (content: string, fileBlob?: Blob) => void;
}

export default function MessageInput({ onSendMessage }: MessageInputProps) {
  const [messageInput, setMessageInput] = useState("");
  const [fileBlob, setFileBlob] = useState<Blob | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileBlob(file);
      setFileName(file.name);
    }
  };

  const handleSendMessage = () => {
    if (messageInput.trim()) {
      onSendMessage(messageInput, fileBlob || undefined);
      setMessageInput("");
      setFileBlob(null);
      setFileName(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <div className="p-4 border-t border-border">
      {/* File Preview */}
      {fileName && (
        <div className="mb-3 p-2 bg-muted rounded-lg flex items-center justify-between text-sm text-foreground">
          <span>📎 {fileName}</span>
          <button
            onClick={() => {
              setFileBlob(null);
              setFileName(null);
              if (fileInputRef.current) {
                fileInputRef.current.value = "";
              }
            }}
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            ✕
          </button>
        </div>
      )}

      <div className="flex gap-3">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          className="hidden"
          accept="*"
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          className="px-3 py-2 bg-muted text-foreground rounded-lg hover:bg-muted/80 transition-colors text-sm font-medium"
        >
          📎
        </button>
        <input
          type="text"
          placeholder="Type a message..."
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              handleSendMessage();
            }
          }}
          className="flex-1 px-4 py-2 bg-input border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
        />
        <button
          onClick={handleSendMessage}
          className="p-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
