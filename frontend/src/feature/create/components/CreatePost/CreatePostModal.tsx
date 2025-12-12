"use client";

import { useCallback, useEffect, useState } from "react";
import { CreatePostHeader } from "./CreatePostHeader";
import { CreatePostUserInfo } from "./CreatePostUserInfo";
import { UploadImages } from "./UploadImages";
import { UploadVideos } from "./UploadVideos";
import { FileGallery } from "./FileGallery";
import { useToast } from "@/shared/context/ToastContext";
import useContentService from "@/shared/hooks/useContentService";
import type FileItem from "@/feature/content/object/FileItem";
import type MediaItem from "@/feature/content/object/MediaItem";
import useUserService from "@/shared/hooks/useUserService";
import type { FullContentDto, UserDto } from "@/service/api";
import { useAuthContext } from "@/feature/auth/context/AuthContext";

interface CreatePostModalProps {
  post?: FullContentDto | null;
  isOpen: boolean;
  onClose: () => void;
  parentPostId?: number;
  currentAreaId: number;
  onRefreshChild: () => void;
  onUpdateComment: (contentId: number, areaId: number) => void;
}

export function CreatePostModal({
  isOpen,
  onClose,
  parentPostId,
  currentAreaId,
  onRefreshChild,
  onUpdateComment,
  post,
}: CreatePostModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { user } = useAuthContext();
  const { showToast } = useToast();
  const { create } = useContentService();

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
    preview: item.preview,
  }));

  const resetForm = () => {
    setIsSubmitting(false);
    setTitle("");
    setDescription("");
    setMedia([]);
    onClose();
  };

  const handleSubmit = async () => {
    if (!title || !description) {
      showToast("Please fill in all fields.");
      return;
    }
    console.log({
      title,
      description,
      media,
      parentPostId,
      creator_id: user?.user_id ?? 0,
    });

    setIsSubmitting(true);

    const thumbnailFile = media.length > 0 ? media[0].file : undefined;
    const contentFiles =
      media.length > 0 ? media.map((item) => item.file) : undefined;

    const res = await create({
      area_id: currentAreaId,
      parent_id: parentPostId,
      creator_id: user?.user_id ?? 0,
      post_type: "post",
      title: title,
      description: description,
      thumbnail: thumbnailFile,
      contents: contentFiles,
      published_at: new Date().toISOString(),
      visibilityPrivate: false,
    });

    if (res) showToast("Post created successfully!");
    else showToast("Failed to create post. Please try again.");

    resetForm();
    if (post) {
      onUpdateComment(post.content_id, currentAreaId);
    }
    onRefreshChild();
  };

  if (!isOpen) {
    return null;
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/95 backdrop-blur-sm  z-40"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="bg-dark-800 fixed inset-0 flex items-center justify-center z-50 p-4">
        <div className="bg-dark-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <CreatePostHeader parentPostId={parentPostId} onClose={onClose} />

          {/* Content */}
          <div className="p-6 space-y-4">
            {/* User Info */}
            {user && (
              <CreatePostUserInfo
                parentPostId={parentPostId}
                creator={user}
                parentAreaId={post?.area_id || currentAreaId}
              />
            )}

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
              disabled={!title.trim() || isSubmitting}
              className="flex-1 px-4 py-2 bg-burgundy-600 text-white rounded-lg hover:bg-burgundy-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Posting..." : parentPostId ? "Reply" : "Post"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
