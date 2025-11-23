"use client";

import { useState } from "react";
import { CreateContentHeader } from "./CreateContent/CreateContentHeader";
import { CreateContentUserInfo } from "./CreateContent/CreateContentUserInfo";
import { ContentTypeSelector } from "./CreateContent/ContentTypeSelector";
import { UploadContentFiles } from "./CreateContent/UploadContentFiles";
import { UploadThumbnail } from "./CreateContent/UploadThumbnail";
import { FileGalleryContent } from "./CreateContent/FileGalleryContent";
import { ThumbnailGallery } from "./CreateContent/ThumbnailGallery";

interface ContentFile {
  id: string;
  file: File;
  name: string;
  type: "image" | "video";
}

interface ThumbnailFile {
  id: string;
  file: File;
  preview: string;
  name: string;
}

interface FileItem {
  id: string;
  name: string;
  type: "image" | "video";
}

interface CreateContentModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUserId: number;
}

export function CreateContentModal({
  isOpen,
  onClose,
  currentUserId,
}: CreateContentModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [contentType, setContentType] = useState<"image" | "video" | null>(
    null
  );
  const [contentFiles, setContentFiles] = useState<ContentFile[]>([]);
  const [thumbnail, setThumbnail] = useState<ThumbnailFile | null>(null);

  if (!isOpen) {
    return null;
  }

  const handleContentFilesSelected = (files: File[]) => {
    files.forEach((file) => {
      const newFile: ContentFile = {
        id: `${Date.now()}-${Math.random()}`,
        file,
        name: file.name,
        type: contentType === "image" ? "image" : "video",
      };
      setContentFiles((prev) => [...prev, newFile]);
    });
  };

  const handleTypeChange = (type: "image" | "video") => {
    setContentType(type);
    setContentFiles([]); // Clear files when type changes
  };

  const handleThumbnailSelected = (file: File) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const preview = event.target?.result as string;
      setThumbnail({
        id: `${Date.now()}-${Math.random()}`,
        file,
        preview,
        name: file.name,
      });
    };
    reader.readAsDataURL(file);
  };

  const removeContentFile = (id: string) => {
    setContentFiles((prev) => prev.filter((item) => item.id !== id));
  };

  const removeThumbnail = () => {
    setThumbnail(null);
  };

  const contentFileItems: FileItem[] = contentFiles.map((item) => ({
    id: item.id,
    name: item.name,
    type: item.type,
  }));

  const handleSubmit = () => {
    // TODO: Submit content to backend
    console.log({
      title,
      description,
      contentType,
      contentFiles,
      thumbnail,
      creator_id: currentUserId,
    });
    // Reset and close
    setTitle("");
    setDescription("");
    setContentType(null);
    setContentFiles([]);
    setThumbnail(null);
    onClose();
  };

  const isFormValid =
    title.trim() && contentType && contentFiles.length > 0 && thumbnail;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black z-40" onClick={onClose} />

      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div className="bg-dark-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <CreateContentHeader onClose={onClose} />

          {/* Content */}
          <div className="p-6 space-y-4">
            {/* User Info */}
            <CreateContentUserInfo currentUserId={currentUserId} />

            {/* Title Input */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="What's your content about?"
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
                placeholder="Add more details about your content..."
                rows={3}
                className="w-full px-4 py-2 bg-dark-700 border border-dark-600 rounded-lg text-gray-100 placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-burgundy-600 resize-none"
              />
            </div>

            {/* Content Type Selector */}
            <ContentTypeSelector
              selectedType={contentType}
              onTypeChange={handleTypeChange}
            />

            {/* Conditional Content Upload Section */}
            {contentType && (
              <div className="space-y-4">
                {/* Upload Files and Gallery Section */}
                <div className="space-y-4 p-4 bg-dark-700 rounded-lg border border-dark-600">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-300">
                      {contentType === "image"
                        ? "Upload Images"
                        : "Upload Videos"}
                    </p>
                    <UploadContentFiles
                      contentType={contentType}
                      onFilesSelected={handleContentFilesSelected}
                    />
                  </div>

                  {/* File Gallery */}
                  <FileGalleryContent
                    files={contentFileItems}
                    onRemove={removeContentFile}
                  />
                </div>

                {/* Thumbnail Section */}
                <div className="space-y-4 p-4 bg-dark-700 rounded-lg border border-dark-600">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-300">
                      Thumbnail <span className="text-burgundy-400">*</span>
                    </p>
                    <UploadThumbnail onFileSelected={handleThumbnailSelected} />
                  </div>

                  {/* Thumbnail Gallery */}
                  <ThumbnailGallery
                    thumbnail={thumbnail}
                    onRemove={removeThumbnail}
                  />
                </div>
              </div>
            )}
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
              disabled={!isFormValid}
              className="flex-1 px-4 py-2 bg-burgundy-600 text-white rounded-lg hover:bg-burgundy-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Create Content
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
