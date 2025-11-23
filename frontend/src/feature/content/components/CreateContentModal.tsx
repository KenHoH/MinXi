"use client";

import { useState } from "react";
import { CreateContentHeader } from "./CreateContent/CreateContentHeader";
import { CreateContentUserInfo } from "./CreateContent/CreateContentUserInfo";
import { ContentTypeSelector } from "./CreateContent/ContentTypeSelector";
import { UploadContentFiles } from "./CreateContent/UploadContentFiles";
import { UploadThumbnail } from "./CreateContent/UploadThumbnail";
import { FileGalleryContent } from "./CreateContent/FileGalleryContent";
import { ThumbnailGallery } from "./CreateContent/ThumbnailGallery";
import type ContentFile from "../object/ContenFile";
import type ThumbnailFile from "../object/ThumbnailFile";
import type FileItem from "../object/FileItem";
import { useToast } from "@/shared/context/ToastContext";
import useContentService from "@/shared/hooks/useContentService";
import useUserService from "@/shared/hooks/useUserService";
import { UserService, type UploadFilesResDto } from "@/services/api";

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
  const [uploadedFilesData, setUploadedFilesData] =
    useState<UploadFilesResDto | null>(null);
  const { showToast } = useToast();
  const {
    create,
    uploadMultipleFiles,
    createFile,
    uploadContentImages,
    getFiles,
  } = useContentService();
  const {} = useUserService();

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
    setContentFiles([]);
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

  const handleSubmit = async () => {
    if (!title || !contentType || !thumbnail) {
      showToast("Please fill in all required fields.");
      return;
    }

    try {
      const userResponse = await UserService.userControllerFindOne(
        currentUserId
      );
      if (!userResponse || !userResponse.user_id || !userResponse.area_id) {
        showToast("Invalid user data.");
        console.error("Invalid user data:", userResponse);
        return;
      }

      if (
        !title.trim() ||
        !description.trim() ||
        contentFiles.length === 0 ||
        !thumbnail
      ) {
        showToast("Please fill in all required fields.");
        return;
      }

      const contentTypeString = contentType === "image" ? "image" : "video";

      const contentData = await create({
        title: title.trim(),
        description: description.trim(),
        creator_id: userResponse.user_id,
        area_id: userResponse.area_id,
        post_type: contentTypeString,
      });

      if (!contentData || !contentData.content_id) {
        showToast("Failed to create content. Please try again.");
        return;
      }

      for (const contentFile of contentFiles) {
        try {
          if (contentData.post_type === "image") {
            const result = await uploadContentImages({
              thumbnail: thumbnail.file,
              contentImage: contentFile.file,
            });
            if (!result || !result.mainImagePath || !result.optionalMediaPath) {
              showToast("Failed to upload files. Please try again.");
              return;
            }

            await createFile({
              content_id: contentData.content_id,
              file_path: result.optionalMediaPath,
              thumbnail: result.mainImagePath,
              area_id: userResponse.area_id,
            });
          } else {
            const result = await uploadMultipleFiles({
              image: thumbnail.file,
              video: contentFile.file,
            });
            if (!result || !result.mainImagePath || !result.optionalMediaPath) {
              showToast("Failed to upload files. Please try again.");
              return;
            }

            await createFile({
              content_id: contentData.content_id,
              file_path: result.optionalMediaPath,
              thumbnail: result.mainImagePath,
              area_id: userResponse.area_id,
            });
          }
        } catch (fileErr) {
          console.error("Failed to process file:", fileErr);
          showToast(
            `Warning: Could not process one of your files. Some content may not be saved.`
          );
        }
      }

      showToast("Content created successfully!");
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to create content. Please try again.";
      showToast(errorMessage);
      console.error("Content creation error:", error);
      return;
    } finally {
      setTitle("");
      setDescription("");
      setContentType(null);
      setContentFiles([]);
      setThumbnail(null);
      onClose();
    }
  };

  const testing = async () => {
    const result = await getFiles(9, 1);
    console.log("GET FILES RESULT:", result);
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
              onClick={testing}
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
