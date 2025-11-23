"use client";

import { useState } from "react";
import { CreatePostHeader } from "./CreatePost/CreatePostHeader";
import { CreatePostUserInfo } from "./CreatePost/CreatePostUserInfo";
import { UploadImages } from "./CreatePost/UploadImages";
import { UploadVideos } from "./CreatePost/UploadVideos";
import { FileGallery } from "./CreatePost/FileGallery";

interface MediaItem {
  id: string;
  file: File;
  preview: string;
  type: "image" | "video";
}

interface FileItem {
  id: string;
  name: string;
  type: "image" | "video";
}

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  parentPostId?: number;
  currentUserId: number;
}

export function CreatePostModal({
  isOpen,
  onClose,
  parentPostId,
  currentUserId,
}: CreatePostModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [media, setMedia] = useState<MediaItem[]>([]);

  if (!isOpen) {
    return null;
  }

  const handleMediaFilesSelected = (files: File[], type: "image" | "video") => {
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const preview = event.target?.result as string;
        setMedia((prev) => [
          ...prev,
          {
            id: `${Date.now()}-${Math.random()}`,
            file,
            preview,
            type,
          },
        ]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeMedia = (id: string) => {
    setMedia((prev) => prev.filter((item) => item.id !== id));
  };

  const fileGalleryItems: FileItem[] = media.map((item) => ({
    id: item.id,
    name: item.file.name,
    type: item.type,
  }));

  const handleSubmit = () => {
    // TODO: Submit post with media to backend
    console.log({
      title,
      description,
      media,
      parentPostId,
      creator_id: currentUserId,
    });
    // Reset and close
    setTitle("");
    setDescription("");
    setMedia([]);
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black z-40" onClick={onClose} />

      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div className="bg-dark-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <CreatePostHeader parentPostId={parentPostId} onClose={onClose} />

          {/* Content */}
          <div className="p-6 space-y-4">
            {/* User Info */}
            <CreatePostUserInfo
              currentUserId={currentUserId}
              parentPostId={parentPostId}
            />

            {/* Title Input */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="What's your post about?"
                className="w-full px-4 py-2 bg-dark-700 border border-dark-600 rounded-lg text-gray-100 placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-burgundy-600"
              />
            </div>

            {/* Description Input */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add more details..."
                rows={4}
                className="w-full px-4 py-2 bg-dark-700 border border-dark-600 rounded-lg text-gray-100 placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-burgundy-600 resize-none"
              />
            </div>

            {/* File Gallery */}
            <FileGallery files={fileGalleryItems} onRemove={removeMedia} />

            {/* Upload Buttons */}
            <div className="flex gap-3">
              <UploadImages
                onFilesSelected={(files) =>
                  handleMediaFilesSelected(files, "image")
                }
              />
              <UploadVideos
                onFilesSelected={(files) =>
                  handleMediaFilesSelected(files, "video")
                }
              />
            </div>
          </div>

          {/* Footer */}
          <div className="flex gap-3 p-6 border-t border-dark-700 bg-dark-900">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-dark-700 text-gray-300 rounded-lg hover:bg-dark-600 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={!title.trim()}
              className="flex-1 px-4 py-2 bg-burgundy-600 text-white rounded-lg hover:bg-burgundy-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {parentPostId ? "Reply" : "Post"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
