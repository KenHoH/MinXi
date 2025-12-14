"use client";

import { useState, useRef } from "react";
import { Send, X, Image, Video, File } from "lucide-react";

interface MessageInputProps {
  onSendMessage: (content: string, fileBlob?: Blob) => void;
}

export default function MessageInput({ onSendMessage }: MessageInputProps) {
  const [messageInput, setMessageInput] = useState("");
  const [fileBlob, setFileBlob] = useState<Blob | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [filePreviewUrl, setFilePreviewUrl] = useState<string | null>(null);
  const [fileType, setFileType] = useState<"image" | "video" | "other" | null>(
    null
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileBlob(file);
      setFileName(file.name);

      if (file.type.startsWith("image/")) {
        setFileType("image");
      } else if (file.type.startsWith("video/")) {
        setFileType("video");
      } else {
        setFileType("other");
      }

      if (file.type.startsWith("image/") || file.type.startsWith("video/")) {
        const previewUrl = URL.createObjectURL(file);
        setFilePreviewUrl(previewUrl);
      }
    }
  };

  const clearFile = () => {
    setFileBlob(null);
    setFileName(null);
    setFileType(null);
    if (filePreviewUrl) {
      URL.revokeObjectURL(filePreviewUrl);
      setFilePreviewUrl(null);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSendMessage = () => {
    if (messageInput.trim()) {
      onSendMessage(messageInput, fileBlob || undefined);
      setMessageInput("");
      clearFile();
    }
  };

  return (
    <div className="p-4 border-t border-border">
      {fileBlob && (
        <div className="mb-3 p-3 bg-dark-800 border border-dark-700 rounded-lg">
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-2 text-sm text-gray-300">
              {fileType === "image" && (
                <Image className="w-4 h-4 text-blue-400" />
              )}
              {fileType === "video" && (
                <Video className="w-4 h-4 text-purple-400" />
              )}
              {fileType === "other" && (
                <File className="w-4 h-4 text-gray-400" />
              )}
              <span className="font-medium">{fileName}</span>
            </div>
            <button
              onClick={clearFile}
              className="p-1 hover:bg-dark-700 rounded transition-colors"
            >
              <X className="w-4 h-4 text-gray-400 hover:text-gray-200" />
            </button>
          </div>

          {/* Image Preview */}
          {fileType === "image" && filePreviewUrl && (
            <div className="mt-2 rounded-lg overflow-hidden bg-dark-900 border border-dark-700">
              <img
                src={filePreviewUrl}
                alt="Preview"
                className="max-h-32 w-auto mx-auto object-contain"
              />
            </div>
          )}

          {/* Video Preview */}
          {fileType === "video" && filePreviewUrl && (
            <div className="mt-2 rounded-lg overflow-hidden bg-dark-900 border border-dark-700">
              <video
                src={filePreviewUrl}
                controls
                className="max-h-32 w-full"
              />
            </div>
          )}
        </div>
      )}

      <div className="flex gap-3">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          className="hidden"
          accept="image/*,video/*"
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          className="px-3 py-2 bg-dark-800 text-gray-300 border border-dark-700 rounded-lg hover:bg-dark-700 transition-colors text-sm font-medium"
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
          className="flex-1 px-4 py-2 bg-dark-800 border border-dark-700 rounded-lg text-gray-100 placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-burgundy-600"
        />
        <button
          onClick={handleSendMessage}
          className="p-2 bg-burgundy-600 text-white rounded-lg hover:bg-burgundy-700 transition-colors"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
