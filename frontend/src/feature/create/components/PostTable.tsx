import { useState } from "react";
import { Plus, Eye, Heart, MessageCircle, Pin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CreatePostModal } from "@/feature/create/components/CreatePost/CreatePostModal";
import { useAuthContext } from "@/feature/auth/context/AuthContext";
import type { FullContentDto } from "@/service/api";
import useContentService from "@/shared/hooks/useContentService";
import { useToast } from "@/shared/context/ToastContext";
import { useNavigate } from "react-router";

interface PostTableProps {
  items: FullContentDto[];
  onRefreshChild: () => void;
  onDelete: (id: number) => void;
}

export function PostTable({ items, onRefreshChild, onDelete }: PostTableProps) {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const { user } = useAuthContext();
  const currentAreaId = user?.area_id || 0;
  const { updateComment, remove } = useContentService();
  const { showToast } = useToast();

  const isDraft = (publishedAt: string | Date) => {
    const now = new Date();
    const publishDate = new Date(publishedAt);
    return now < publishDate;
  };

  const handleUpdateComment = async (contentId: number, areaId: number) => {
    await updateComment(contentId, areaId, { delta: 1 });
  };

  const handleDelete = async (id: number, areaId: number) => {
    setDeletingId(id);
    try {
      await remove(id, areaId);
      onDelete(id);
      showToast("Post deleted successfully");
    } catch (error) {
      showToast("Failed to delete post");
      console.error(error);
    } finally {
      setDeletingId(null);
    }
  };

  const navigate = useNavigate();
  const navigateToPost = (
    username: string,
    contentId: number,
    area: number
  ) => {
    navigate(`/feed/${username}/${contentId}/post/${area}`, { replace: true });
  };

  return (
    <div className="space-y-6">
      <Button
        onClick={() => setShowCreateModal(true)}
        className="bg-burgundy-600 text-white hover:bg-red-400 flex items-center gap-2 transition-colors delay-100"
      >
        <Plus className="w-5 h-5" />
        Create New Post
      </Button>
      <CreatePostModal
        onRefreshChild={onRefreshChild}
        onUpdateComment={handleUpdateComment}
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        currentAreaId={currentAreaId}
      />

      {items.length === 0 ? (
        <div className="text-center py-12 bg-dark-800 rounded-lg border border-dark-700">
          <p className="text-gray-400">No posts created yet</p>
        </div>
      ) : (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <div
              key={item.content_id}
              className="bg-dark-800 rounded-lg border border-dark-700 overflow-hidden hover:border-burgundy-600/50 transition-colors flex flex-col"
              onClick={() =>
                navigateToPost(item.username, item.content_id, item.area_id)
              }
            >
              {/* Post Info */}
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
                <div className="grid grid-cols-4 gap-2 text-xs text-gray-400 mb-3">
                  <span className="flex items-center gap-1">
                    <Eye className="w-6 h-6 hover:text-red-400 transition-colors" />
                    {item.views || 0}
                  </span>
                  <span className="flex items-center gap-1">
                    <Heart className="w-6 h-6 hover:text-red-400 transition-colors" />
                    {item.likes || 0}
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageCircle className="w-6 h-6 hover:text-red-400 transition-colors" />
                    {item.comments || 0}
                  </span>
                  <span className="flex items-center gap-1">
                    <Pin className="w-6 h-6 hover:text-red-400 transition-colors" />
                    {item.pins || 0}
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
                  className="w-full px-3 py-2 bg-dark-700 hover:bg-primary text-white rounded text-xs font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
