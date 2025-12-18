"use client";

import { useState, useRef } from "react";
import { Send, Trash2 } from "lucide-react";

interface MessageInputProps {
  onSendMessage: (content: string, fileBlob?: Blob) => void;
}

export default function MessageInput({ onSendMessage }: MessageInputProps) {
  const [messageInput, setMessageInput] = useState("");
  const [fileBlob, setFileBlob] = useState<Blob | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileType, setFileType] = useState("");

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileBlob(file);
      setFileName(file.name);

      if (file.type.startsWith("image/")) {
        setFileType("IMAGE");
      } else if (file.type.startsWith("video/")) {
        setFileType("VIDEO");
      }
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
      {fileName && fileBlob && (
        <div className="relative mb-3 p-3 bg-input rounded-lg text-sm text-foreground">
          <div className="flex flex-col items-baseline gap-2">
            {fileType === "IMAGE" ? (
              <img
                src={URL.createObjectURL(fileBlob)}
                alt={fileName}
                className="max-h-40 rounded-lg"
              />
            ) : (
              <video
                src={URL.createObjectURL(fileBlob)}
                className="max-h-40 rounded-lg"
                controls={false}
              />
            )}

            <p className="text-xs text-muted-foreground break-all text-center">
              {fileName}
            </p>
          </div>

          <button
            onClick={() => {
              setFileBlob(null);
              setFileName(null);
              if (fileInputRef.current) {
                fileInputRef.current.value = "";
              }
            }}
            className="absolute top-4 left-4 flex items-center justify-center w-7 h-7 rounded-full bg-red-400 text-white hover:bg-red-500 transition"
            aria-label="Remove file"
          >
            <Trash2 className="w-4 h-4" />
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
