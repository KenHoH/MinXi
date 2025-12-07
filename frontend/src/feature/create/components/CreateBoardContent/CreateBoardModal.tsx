import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { ProfilePicture } from "../../../content/components/ProfilePicture";
import { ThumbnailPreview } from "./ThumbnailPreview";
import { UploadBoardThumbnail } from "./UploadBoardThumbnail";
import { MasonrySelector } from "./MasonrySelector";
import { SelectedItemsPreview } from "./SelectedItemsPreview";
import { useAuthContext } from "@/feature/auth/context/AuthContext";
import { useToast } from "@/shared/context/ToastContext";
import type { UserDto, FileDto, BoardDto } from "@/service/api";
import useBoardService from "@/shared/hooks/useBoardService";
import useUserService from "@/shared/hooks/useUserService";
import useContentService from "@/shared/hooks/useContentService";
import { Switch } from "@/components/ui/switch";

interface ContentGalleryItem {
  content_id: number;
  title: string;
  type: "image" | "video";
  thumbnail: FileDto;
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
  thumbnail?: FileDto;
}

interface CreateBoardModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUserId: number;
  onBoardCreated?: () => void;
}

type GalleryItem = (ContentGalleryItem | PostGalleryItem) & {
  type?: "image" | "video" | "post";
};

export function CreateBoardModal({
  isOpen,
  onClose,
  currentUserId,
  onBoardCreated,
}: CreateBoardModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [thumbnail, setThumbnail] = useState<ThumbnailFile | null>(null);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [allItems, setAllItems] = useState<GalleryItem[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loggedUserData, setLoggedUserData] = useState<UserDto | null>(null);
  const { showToast } = useToast();
  const { user } = useAuthContext();
  const { create } = useBoardService();
  const { findUserById } = useUserService();
  const { getByUserAll } = useContentService();

  // Fetch user's content when modal opens
  useEffect(() => {
    if (isOpen && user?.user_id) {
      const fetchUserContent = async () => {
        try {
          const userContent = await getByUserAll(user.user_id);
          if (userContent) {
            const mappedContents: GalleryItem[] = userContent.map((item) => ({
              content_id: item.content_id,
              title: item.title,
              type: item.post_type as "image" | "video" | "post",
              thumbnail: item.thumbnail,
            }));
            setAllItems(mappedContents);
          }
        } catch (error) {
          console.error("Failed to fetch user content:", error);
          showToast("Failed to load your content");
        }
      };
      fetchUserContent();
    }
  }, [isOpen, user?.user_id]);

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

  const selectedItems = allItems
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

    if (!trimmedTitle || !trimmedDesc || !thumbnail) {
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
    setIsSubmitting(true);

    const validContents = selectedIds.filter((id) => id && !isNaN(id));
    const contentsString =
      validContents.length > 0 ? validContents.join(",") : "";

    const formDataPayload = {
      visibility: isPrivate,
      creator_id: currentUserId,
      title: title.trim(),
      description: description.trim(),
      thumbnail: thumbnail!.file,
      area_id: loggedUserData?.area_id || undefined,
      contents: contentsString,
    };

    const res = await create(formDataPayload as any);

    if (res) {
      showToast("Board created successfully!");
      onBoardCreated && onBoardCreated();
      onClose();
    } else {
      showToast("Failed to create board. Please try again.");
    }
    setIsSubmitting(false);
    resetForm();
  };

  useEffect(() => {
    const fetchLoggedUser = async () => {
      if (user && user.user_id) {
        await findUserById(user.user_id).then((res) => {
          setLoggedUserData(res);
        });
      }
    };
    fetchLoggedUser();
  }, [user]);

  if (!isOpen) {
    return null;
  }
  const isFormValid = title.trim() && thumbnail;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black backdrop-blur-sm z-40"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div className="bg-dark-800 rounded-lg max-w-3xl w-full max-h-[95vh] overflow-hidden flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-dark-700 bg-dark-800 z-10 shrink-0">
            <h2 className="text-xl font-bold text-gray-100">Create Board</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-dark-700 rounded-full transition-colors"
            >
              <X className="w-6 h-6 text-gray-300" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-dark-750">
            {/* User Info */}
            <div className="flex items-center gap-3">
              <ProfilePicture
                creator={{
                  profile_picture_url: loggedUserData?.profile_picture || "",
                  username: loggedUserData?.username || "User",
                  user_id: loggedUserData?.user_id || 0,
                }}
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
                className="w-full px-4 py-2 bg-dark-700 border border-dark-600 rounded-lg text-gray-100 placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-red-400 hover:border-red-400"
              />
            </div>

            {/* Description Input */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2 ">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe what this board is about..."
                rows={3}
                className="w-full px-4 py-2 bg-dark-700 border border-dark-600 rounded-lg text-gray-100 placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-red-400 resize-none hover:border-red-400"
              />
            </div>

            {/* Thumbnail Section */}
            <div className="space-y-3 p-4 bg-dark-700 rounded-lg border border-dark-600 flex flex-col items-center hover:border-red-400">
              <div className="w-full">
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
            <div className="flex flex-col items-center bg-dark-700 rounded-lg border border-dark-600 hover:border-red-400">
              <div className="w-3/5 flex items-center  p-4 ">
                <label
                  htmlFor="private"
                  className="flex-1 text-sm text-gray-300 cursor-pointer"
                >
                  Make this Board private (Only you can see it)
                </label>
                <Switch
                  checked={isPrivate}
                  onCheckedChange={() => setIsPrivate((prev) => !prev)}
                />
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-dark-700" />

            {/* Selection Gallery */}
            <div className="space-y-4">
              <p className="text-sm font-medium text-gray-200">
                Add Items to Board <span className="text-burgundy-400">*</span>
              </p>

              {/* Items Table */}
              <div className="space-y-2 max-h-96 overflow-y-auto items-center flex flex-col">
                {allItems.map((item) => {
                  const isSelected = selectedIds.includes(item.content_id);
                  const thumbnail = (item as ContentGalleryItem).thumbnail;

                  return (
                    <div
                      key={item.content_id}
                      onClick={() => toggleSelection(item.content_id)}
                      className={`w-3/4 flex gap-3 p-4 rounded-lg cursor-pointer border-2 transition-all hover:border-red-400  ${
                        isSelected
                          ? "border-burgundy-600 bg-burgundy-600/10"
                          : "border-dark-600 hover:border-burgundy-600/50 bg-dark-700"
                      }`}
                    >
                      {/* Thumbnail */}
                      <div className="w-16 h-16 rounded overflow-hidden flex-shrink-0 ">
                        {thumbnail?.filepath ? (
                          <img
                            src={thumbnail.filepath}
                            alt={item.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-dark-600 flex items-center justify-center">
                            <span className="text-xs text-gray-500">
                              No image
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Content Info */}
                      <div className="flex-1 min-w-0 ml-2">
                        <h4 className="text-sm font-semibold text-gray-100 truncate">
                          {item.title}
                        </h4>
                        <p className="text-xs text-gray-400 line-clamp-2 mt-1">
                          {item.type === "post"
                            ? "Post"
                            : `${item.type} content`}
                        </p>
                      </div>

                      {/* Checkbox */}
                      <div className="flex-shrink-0 flex items-center mr-4">
                        <div
                          className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                            isSelected
                              ? "bg-burgundy-600 border-burgundy-600"
                              : "border-gray-500"
                          }`}
                        >
                          {isSelected && (
                            <svg
                              className="w-3 h-3 text-white"
                              fill="none"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Selected Items Preview */}
              <SelectedItemsPreview
                items={selectedItems}
                onRemove={removeSelected}
              />
            </div>
          </div>

          {/* Footer */}
          <div className="flex gap-3 p-6 border-t border-dark-700 bg-dark-800 z-10 shrink-0">
            <button
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 px-4 py-2 bg-dark-700 text-gray-300 rounded-lg hover:bg-dark-600 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-red-400 hover:text-black "
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={!isFormValid || isSubmitting}
              className="flex-1 px-4 py-2 bg-burgundy-600 text-white rounded-lg hover:bg-burgundy-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed "
            >
              {isSubmitting ? "Creating..." : "Create Board"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
