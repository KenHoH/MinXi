"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { ProfilePicture } from "./ProfilePicture";
import { ThumbnailPreview } from "./CreateBoardContent/ThumbnailPreview";
import { UploadBoardThumbnail } from "./CreateBoardContent/UploadBoardThumbnail";
import { MasonrySelector } from "./CreateBoardContent/MasonrySelector";
import { SelectedItemsPreview } from "./CreateBoardContent/SelectedItemsPreview";

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
  onClose: () => void;
  currentUserId: number;
}

// Mock data for all items (posts + content combined)
type GalleryItem = (ContentGalleryItem | PostGalleryItem) & {
  type?: "image" | "video" | "post";
};

const mockAllItems: GalleryItem[] = [
  { content_id: 1, title: "My Amazing Journey Through Europe", type: "post" },
  { content_id: 2, title: "Tips for Better Photography", type: "post" },
  {
    content_id: 101,
    title: "Sunset at the Beach",
    type: "image",
    thumbnail:
      "http://localhost:3000/uploads/thumbnail/1763296139023-929553449.jpg",
  },
  {
    content_id: 102,
    title: "City Walk Vlog",
    type: "video",
    thumbnail:
      "http://localhost:3000/uploads/thumbnail/1763296139023-929553449.jpg",
  },
  { content_id: 3, title: "Design Principles I Live By", type: "post" },
  { content_id: 4, title: "Travel on a Budget", type: "post" },
  {
    content_id: 103,
    title: "Mountain Peak Views",
    type: "image",
    thumbnail:
      "http://localhost:3000/uploads/thumbnail/1763296139023-929553449.jpg",
  },
  {
    content_id: 104,
    title: "Cooking Tutorial",
    type: "video",
    thumbnail:
      "http://localhost:3000/uploads/thumbnail/1763296139023-929553449.jpg",
  },
  { content_id: 5, title: "Understanding Color Theory", type: "post" },
  {
    content_id: 105,
    title: "Urban Photography",
    type: "image",
    thumbnail:
      "http://localhost:3000/uploads/thumbnail/1763296139023-929553449.jpg",
  },
  {
    content_id: 106,
    title: "Travel Montage",
    type: "video",
    thumbnail:
      "http://localhost:3000/uploads/thumbnail/1763296139023-929553449.jpg",
  },
];

export function CreateBoardModal({
  isOpen,
  onClose,
  currentUserId,
}: CreateBoardModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [thumbnail, setThumbnail] = useState<ThumbnailFile | null>(null);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

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

  // Get selected items
  const selectedItems = mockAllItems
    .filter((item) => selectedIds.includes(item.content_id))
    .map((item) => ({
      content_id: item.content_id,
      title: item.title,
      type: item.type || "post",
      thumbnail: (item as ContentGalleryItem).thumbnail,
    })) as SelectedItem[];

  const handleSubmit = () => {
    // TODO: Submit board to backend
    console.log({
      title,
      description,
      isPrivate,
      thumbnail,
      selectedItems: selectedIds,
      creator_id: currentUserId,
    });
    // Reset and close
    setTitle("");
    setDescription("");
    setIsPrivate(false);
    setThumbnail(null);
    setSelectedIds([]);
    onClose();
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
          <div className="flex items-center justify-between p-6 border-b border-gray-700 bg-black z-10 flex-shrink-0">
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
                  @creator{currentUserId}
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
              className="flex-1 px-4 py-2 bg-gray-900 text-gray-300 rounded-lg hover:bg-gray-800 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={!isFormValid}
              className="flex-1 px-4 py-2 bg-burgundy-600 text-white rounded-lg hover:bg-burgundy-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Create Board
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
