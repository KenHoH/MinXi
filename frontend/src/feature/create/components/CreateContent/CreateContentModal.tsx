import { useState } from "react";
import { useToast } from "@/shared/context/ToastContext";
import useContentService from "@/shared/hooks/useContentService";
import type ThumbnailFile from "@/feature/content/object/ThumbnailFile";
import type ContentFile from "@/feature/content/object/ContenFile";
import type FileItem from "@/feature/content/object/FileItem";
import { CreateContentHeader } from "./CreateContentHeader";
import { ContentTypeSelector } from "./ContentTypeSelector";
import { UploadContentFiles } from "./UploadContentFiles";
import { FileGalleryContent } from "./FileGalleryContent";
import { UploadThumbnail } from "./UploadThumbnail";
import { ThumbnailGallery } from "./ThumbnailGallery";
import { Input } from "@/components/ui/input";
import { Calendar } from "lucide-react";
import { Switch } from "@/components/ui/switch";
interface CreateContentModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUserId: number;
  currentAreaId: number;
}

export function CreateContentModal({
  isOpen,
  onClose,
  currentUserId,
  currentAreaId,
}: CreateContentModalProps) {
  const [contentTitle, setContentTitle] = useState("");
  const [description, setDescription] = useState("");
  const [contentType, setContentType] = useState<"image" | "video" | null>(
    null
  );
  const [contentFiles, setContentFiles] = useState<ContentFile[]>([]);
  const [thumbnail, setThumbnail] = useState<ThumbnailFile | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPrivate, setIsPrivate] = useState(false);
  const [publishedAt, setPublishedAt] = useState("");
  const { showToast } = useToast();
  const { create, loading } = useContentService();

  const isFormValid =
    contentTitle.trim() !== "" &&
    contentType !== null &&
    contentFiles.length > 0 &&
    thumbnail !== null;

  const handleContentFilesSelected = (files: File[]) => {
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const preview = event.target?.result as string;
        const newFile: ContentFile = {
          id: `${Date.now()}-${Math.random()}`,
          file,
          name: file.name,
          type: contentType === "image" ? "image" : "video",
          preview,
        };
        setContentFiles((prev) => [...prev, newFile]);
      };
      reader.readAsDataURL(file);
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
    preview: item.preview,
  }));

  const resetForm = () => {
    setContentTitle("");
    setDescription("");
    setContentType(null);
    setContentFiles([]);
    setThumbnail(null);
    onClose();
  };

  const handleSubmit = async () => {
    if (
      !contentTitle ||
      !contentType ||
      !thumbnail ||
      contentFiles.length === 0
    ) {
      showToast("Please fill in all required fields.");
      return;
    }

    // Validate published_at if provided
    if (publishedAt) {
      const selectedDate = new Date(publishedAt);
      if (isNaN(selectedDate.getTime())) {
        showToast("Invalid publish date. Please select a valid date.");
        return;
      }
    }

    try {
      setIsSubmitting(true);

      await create({
        thumbnail: thumbnail.file,
        creator_id: currentUserId,
        area_id: currentAreaId,
        post_type: contentType,
        title: contentTitle,
        description: description,
        published_at: publishedAt
          ? new Date(publishedAt).toISOString()
          : new Date().toISOString(),
        visibilityPrivate: isPrivate,
        contents: contentFiles.map((file) => file.file),
      });
    } catch (error) {
      showToast("Failed to create content. Please try again.");
    } finally {
      setIsSubmitting(false);
      showToast("Content created successfully!");
      resetForm();
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <>
      <div className="fixed inset-0 bg-black z-40" onClick={onClose} />

      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div className="bg-dark-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <CreateContentHeader onClose={onClose} />

          {/* Content */}
          <div className="p-6 space-y-4">
            {/* Title Input */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Title
              </label>
              <input
                type="text"
                value={contentTitle}
                onChange={(e) => setContentTitle(e.target.value)}
                placeholder="What's your content about?"
                className="w-full px-4 py-2 bg-dark-700 border border-dark-600 rounded-lg text-gray-100 placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-red-500 "
              />
            </div>
            {/* Date Input */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Published At{" "}
                <span className="text-gray-500 text-xs">
                  (Optional - defaults to now)
                </span>
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                <Input
                  type="datetime-local"
                  value={publishedAt}
                  onChange={(e) => setPublishedAt(e.target.value)}
                  placeholder="Select publish date and time"
                  className="pl-10 bg-dark-700 border border-dark-600 text-gray-100 placeholder:text-gray-500"
                />
              </div>
              {publishedAt && (
                <p className="mt-2 text-xs text-gray-400 flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  Publishing on: {new Date(publishedAt).toLocaleString()}
                </p>
              )}
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

            <div className="flex items-center gap-3 p-4 bg-dark-700 rounded-lg border border-dark-600">
              <label
                htmlFor="private"
                className="flex-1 text-sm text-gray-300 cursor-pointer"
              >
                Make this Content private (Only you can see it)
              </label>
              <Switch
                checked={isPrivate}
                onCheckedChange={() => setIsPrivate((prev) => !prev)}
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
              disabled={isSubmitting || loading}
              className="flex-1 px-4 py-2 bg-dark-700 text-gray-300 rounded-lg hover:bg-dark-600 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={!isFormValid || isSubmitting || loading}
              className="flex-1 px-4 py-2 bg-burgundy-600 text-white rounded-lg hover:bg-burgundy-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting || loading ? "Creating..." : "Create Content"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
