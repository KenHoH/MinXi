import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { ProfilePicture } from "../../../content/components/ProfilePicture";
import { ThumbnailPreview } from "./ThumbnailPreview";
import { UploadBoardThumbnail } from "./UploadBoardThumbnail";
import { MasonrySelector } from "./MasonrySelector";
import { SelectedItemsPreview } from "./SelectedItemsPreview";
import { useAuthContext } from "@/feature/auth/context/AuthContext";
import { useToast } from "@/shared/context/ToastContext";
import type { FullContentDto } from "@/service/api";
import useBoardService from "@/shared/hooks/useBoardService";

interface ContentGalleryItem {
  content_id: number;
  title: string;
  type: "image" | "video";
  thumbnail: string;
}

interface PostGalleryItem {
  content_id: number;
  title: string;
}

interface ThumbnailFile {
  file: File;
  preview: string;
  name: string;
}

interface SelectedItem {
  content_id: number;
  title: string;
  type: "image" | "video" | "post";
  thumbnail?: string;
}

interface CreateBoardModalProps {
  isOpen: boolean;
  contents: FullContentDto[];
  onClose: () => void;
  currentUserId: number;
}

type GalleryItem = (ContentGalleryItem | PostGalleryItem) & {
  type?: "image" | "video" | "post";
};

export function CreateBoardModal({
  isOpen,
  contents,
  onClose,
  currentUserId,
}: CreateBoardModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [thumbnail, setThumbnail] = useState<ThumbnailFile | null>(null);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [mockAllItems, setMockAllItems] = useState<GalleryItem[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showToast } = useToast();
  const { user } = useAuthContext();
  const { create } = useBoardService();

  useEffect(() => {
    console.log(contents);
    const mappedContents = contents.map((item) => ({
      content_id: item.content_id,
      title: item.title,
      type: item.post_type as "image" | "video" | "post",
      thumbnail: item.thumbnail,
    }));
    setMockAllItems(mappedContents);
  }, [contents]);

  if (!isOpen) {
    return null;
  }

  const handleThumbnailSelected = (file: File) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const preview = event.target?.result as string;
      setThumbnail({
        file,
        preview,
        name: file.name,
      });
    };
    reader.readAsDataURL(file);
  };

  const removeThumbnail = () => {
    setThumbnail(null);
  };

  const toggleSelection = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
    );
  };

  const removeSelected = (id: number) => {
    setSelectedIds((prev) => prev.filter((sid) => sid !== id));
  };

  const selectedItems = mockAllItems
    .filter((item) => selectedIds.includes(item.content_id))
    .map((item) => ({
      content_id: item.content_id,
      title: item.title,
      type: item.type || "post",
      thumbnail: (item as ContentGalleryItem).thumbnail,
    })) as SelectedItem[];

  const validateForm = (): boolean => {
    const trimmedTitle = title.trim();
    const trimmedDesc = description.trim();

    if (
      !trimmedTitle ||
      !trimmedDesc ||
      !thumbnail ||
      selectedIds.length === 0
    ) {
      showToast("Please fill in all required fields.");
      return false;
    }
    return true;
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setIsPrivate(false);
    setThumbnail(null);
    setSelectedIds([]);
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;
    if (!validateForm()) return;

    const res = await create({
      visibility: isPrivate,
      contents: selectedIds,
      creator_id: currentUserId,
      title: title.trim(),
      description: description.trim(),
      thumbnail: thumbnail!.file,
    });

    if (res) {
      showToast("Board created successfully!");
      onClose();
      setIsSubmitting(true);
    } else {
      showToast("Failed to create board. Please try again.");
    }
    resetForm();
  };

  const isFormValid = title.trim() && thumbnail && selectedItems.length > 0;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black z-40" onClick={onClose} />

      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div className="bg-black rounded-lg max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-700 bg-black z-10 shrink-0">
            <h2 className="text-xl font-bold text-gray-100">Create Board</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-900 rounded-full transition-colors"
            >
              <X className="w-6 h-6 text-gray-300" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* User Info */}
            <div className="flex items-center gap-3">
              <ProfilePicture
                creator_id={currentUserId}
                size="md"
                clickable={false}
              />
              <div>
                <p className="font-semibold text-gray-100">
                  @{user?.username || "User"}
                </p>
              </div>
            </div>

            {/* Title Input */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Board Name <span className="text-burgundy-400">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Give your board a name..."
                className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-gray-100 placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-burgundy-600"
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
                placeholder="Describe what this board is about..."
                rows={3}
                className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-gray-100 placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-burgundy-600 resize-none"
              />
            </div>

            {/* Thumbnail Section */}
            <div className="space-y-3 p-4 bg-gray-900 rounded-lg border border-gray-700">
              <div>
                <p className="text-sm font-medium text-gray-300 mb-3">
                  Board Thumbnail <span className="text-burgundy-400">*</span>
                </p>
                <UploadBoardThumbnail
                  onFileSelected={handleThumbnailSelected}
                />
              </div>
              <ThumbnailPreview
                preview={thumbnail?.preview || null}
                fileName={thumbnail?.name || null}
                onRemove={removeThumbnail}
              />
            </div>

            {/* Privacy Toggle */}
            <div className="flex items-center gap-3 p-4 bg-gray-900 rounded-lg border border-gray-700">
              <input
                type="checkbox"
                id="private"
                checked={isPrivate}
                onChange={(e) => setIsPrivate(e.target.checked)}
                className="w-4 h-4 bg-gray-700 border border-gray-600 rounded accent-burgundy-600 cursor-pointer"
              />
              <label
                htmlFor="private"
                className="flex-1 text-sm text-gray-300 cursor-pointer"
              >
                Make this board private (Only you can see it)
              </label>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-700" />

            {/* Selection Gallery */}
            <div className="space-y-6">
              <p className="text-sm font-medium text-gray-200">
                Add Items to Board <span className="text-burgundy-400">*</span>
              </p>

              {/* Masonry Gallery */}
              <MasonrySelector
                title="Your Posts & Content"
                items={mockAllItems}
                selectedIds={selectedIds}
                onToggleSelect={toggleSelection}
              />

              {/* Selected Items Preview */}
              <SelectedItemsPreview
                items={selectedItems}
                onRemove={removeSelected}
              />
            </div>
          </div>

          {/* Footer */}
          <div className="flex gap-3 p-6 border-t border-gray-700 bg-black z-10 shrink-0">
            <button
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 px-4 py-2 bg-gray-900 text-gray-300 rounded-lg hover:bg-gray-800 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={!isFormValid || isSubmitting}
              className="flex-1 px-4 py-2 bg-burgundy-600 text-white rounded-lg hover:bg-burgundy-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Creating..." : "Create Board"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
