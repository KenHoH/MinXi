import { useState } from "react";
import { Plus, Image, FileText, Eye, Heart, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthContext } from "@/feature/auth/context/AuthContext";
import type { FullContentDto } from "@/service/api";
import { CreateContentModal } from "./CreateContent/CreateContentModal";
import useContentService from "@/shared/hooks/useContentService";
import { useToast } from "@/shared/context/ToastContext";

interface ContentTableProps {
  items: FullContentDto[];
  onDelete: (id: number) => void;
}

export function ContentTable({ items, onDelete }: ContentTableProps) {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const { user } = useAuthContext();
  const { remove } = useContentService();
  const { showToast } = useToast();

  const currentUserId = user?.user_id || 0;
  const currentAreaId = user?.area_id || 0;

  const isDraft = (publishedAt: string | Date) => {
    const now = new Date();
    const publishDate = new Date(publishedAt);
    return now < publishDate;
  };

  const handleDelete = async (id: number, areaId: number) => {
    setDeletingId(id);
    try {
      await remove(id, areaId);
      onDelete(id);
      showToast("Content deleted successfully");
    } catch (error) {
      showToast("Failed to delete content");
      console.error(error);
    } finally {
      setDeletingId(null);
    }
  };

  const getFileIcon = (filepath: string) => {
    if (filepath.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
      return "image";
    }
    if (filepath.match(/\.(mp4|webm|mov|avi)$/i)) {
      return "video";
    }
    return "file";
  };

  return (
    <div className="space-y-6">
      <Button
        onClick={() => setShowCreateModal(true)}
        className="bg-burgundy-600 text-white hover:bg-burgundy-700 flex items-center gap-2"
      >
        <Plus className="w-5 h-5" />
        Create New Content
      </Button>

      {user && (
        <CreateContentModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          currentUserId={currentUserId}
          currentAreaId={currentAreaId}
        />
      )}

      {items.length === 0 ? (
        <div className="text-center py-12 bg-dark-800 rounded-lg border border-dark-700">
          <p className="text-gray-400">No content created yet</p>
        </div>
      ) : (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <div
              key={item.content_id}
              className="bg-dark-800 rounded-lg border border-dark-700 overflow-hidden hover:border-burgundy-600/50 transition-colors flex flex-col"
            >
              {/* Thumbnail Image */}
              <div className="relative w-full bg-dark-750 overflow-hidden h-60">
                {item.contents && item.contents.length > 0 ? (
                  (() => {
                    const firstFile = item.contents[0];
                    const fileType = getFileIcon(firstFile.filepath);
                    return fileType === "image" ? (
                      <img
                        src={firstFile.filepath}
                        alt={item.title}
                        className="w-full h-full object-fit"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = "none";
                        }}
                      />
                    ) : fileType === "video" ? (
                      <video
                        src={firstFile.filepath}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLVideoElement).style.display = "none";
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <FileText className="w-12 h-12 text-gray-600" />
                      </div>
                    );
                  })()
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Image className="w-12 h-12 text-gray-600" />
                  </div>
                )}
              </div>

              {/* Content Info */}
              <div className="flex-1 p-4 flex flex-col">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="text-sm font-semibold text-gray-100 line-clamp-2 flex-1">
                    {item.title}
                  </h3>
                  <span
                    className={`inline-block px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap shrink-0 ${
                      isDraft(item.published_at)
                        ? "bg-yellow-500/20 text-yellow-400"
                        : "bg-green-500/20 text-green-400"
                    }`}
                  >
                    {isDraft(item.published_at) ? "Draft" : "Published"}
                  </span>
                </div>

                <p className="text-xs text-gray-400 mb-3 line-clamp-1">
                  {item.description || "No description"}
                </p>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-2 text-xs text-gray-400 mb-3">
                  <span className="flex items-center gap-1">
                    <Eye className="w-3 h-3" />
                    {item.views || 0}
                  </span>
                  <span className="flex items-center gap-1">
                    <Heart className="w-3 h-3" />
                    {item.likes || 0}
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageCircle className="w-3 h-3" />
                    {item.comments || 0}
                  </span>
                </div>

                {/* Date */}
                <p className="text-xs text-gray-500 mb-3">
                  {new Date(item.published_at).toLocaleDateString()}
                </p>

                {/* Delete Button */}
                <button
                  onClick={() => handleDelete(item.content_id, item.area_id)}
                  disabled={deletingId === item.content_id}
                  className="w-full px-3 py-2 bg-dark-700 hover:bg-red-600/20 text-red-400 rounded text-xs font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {deletingId === item.content_id ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
