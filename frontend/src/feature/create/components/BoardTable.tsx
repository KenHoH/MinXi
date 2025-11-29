import { useState } from "react";
import {
  Plus,
  Trash2,
  ChevronDown,
  ChevronRight,
  X,
  Image,
  Video,
  FileText,
  Package,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { CreateBoardModal } from "@/feature/create/components/CreateBoardContent/CreateBoardModal";
import { useAuthContext } from "@/feature/auth/context/AuthContext";
import type { BoardDto } from "@/service/api";
import useBoardService from "@/shared/hooks/useBoardService";
import { useToast } from "@/shared/context/ToastContext";

interface BoardTableProps {
  items: BoardDto[];
  onDelete: (id: number) => void;
}

export function BoardTable({ items, onDelete }: BoardTableProps) {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [expandedBoardId, setExpandedBoardId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [removingContentId, setRemovingContentId] = useState<number | null>(
    null
  );
  const { user } = useAuthContext();
  const { removeContent, deleteBoard } = useBoardService();
  const { showToast } = useToast();

  const currentUserId = user?.user_id || 0;

  const handleDeleteBoard = async (boardId: number) => {
    setDeletingId(boardId);
    try {
      await deleteBoard(boardId);
      onDelete(boardId);
      showToast("Board deleted successfully");
    } catch (error) {
      showToast("Failed to delete board");
      console.error(error);
    } finally {
      setDeletingId(null);
    }
  };

  const handleRemoveContent = async (boardId: number, contentId: number) => {
    setRemovingContentId(contentId);
    try {
      await removeContent(boardId, user?.area_id || 0, {
        content_id: contentId,
      });
      showToast("Content removed from board");
      // Refresh by toggling the expanded state to reload
      setExpandedBoardId(null);
      setTimeout(() => setExpandedBoardId(boardId), 100);
    } catch (error) {
      showToast("Failed to remove content from board");
      console.error(error);
    } finally {
      setRemovingContentId(null);
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
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
        Create New Board
      </Button>

      <CreateBoardModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        currentUserId={currentUserId}
      />

      {items.length === 0 ? (
        <div className="text-center py-12 bg-dark-800 rounded-lg border border-dark-700">
          <p className="text-gray-400">No boards created yet</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {items.map((board) => (
            <div
              key={board.board_id}
              className="bg-dark-800 rounded-lg border border-dark-700 overflow-hidden hover:border-burgundy-600/50 transition-colors"
            >
              {/* Board Card Header */}
              <div className="p-4 sm:p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-100 mb-2 truncate">
                      {board.title}
                    </h3>
                    <p className="text-sm text-gray-400 mb-3 line-clamp-2">
                      {board.description || "No description"}
                    </p>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                      <span className="flex items-center gap-1">
                        <Package className="w-4 h-4" />
                        {board.contents?.length || 0} items
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {formatDate(board.created_at)}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      Created: {new Date(board.created_at).toLocaleString()}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDeleteBoard(board.board_id)}
                    disabled={deletingId === board.board_id}
                    className="shrink-0 p-2 text-red-400 hover:bg-red-600/20 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Toggle Contents Button */}
              <button
                onClick={() =>
                  setExpandedBoardId(
                    expandedBoardId === board.board_id ? null : board.board_id
                  )
                }
                className="w-full px-4 sm:px-6 py-3 border-t border-dark-700 bg-dark-750 hover:bg-dark-700 transition-colors flex items-center justify-between text-sm font-medium text-gray-300"
              >
                <span className="flex items-center gap-2">
                  {expandedBoardId === board.board_id ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )}
                  Contents
                </span>
              </button>

              {/* Expanded Contents List */}
              {expandedBoardId === board.board_id && (
                <div className="px-4 sm:px-6 py-4 border-t border-dark-700 bg-dark-750">
                  {board.contents && board.contents.length > 0 ? (
                    <div className="space-y-3">
                      {board.contents.map((content) => (
                        <div
                          key={content.content_id}
                          className="flex flex-col gap-2 p-3 bg-dark-800 rounded border border-dark-700/50 hover:border-burgundy-600/50 transition-colors"
                        >
                          {/* Content Header */}
                          <div className="flex items-center justify-between gap-3">
                            <div className="flex-1 min-w-0">
                              <p className="text-sm text-gray-100 font-medium truncate">
                                {content.title}
                              </p>
                              <p className="text-xs text-gray-500 truncate">
                                {content.description || "No description"}
                              </p>
                            </div>
                            <button
                              onClick={() =>
                                handleRemoveContent(
                                  board.board_id,
                                  content.content_id
                                )
                              }
                              disabled={
                                removingContentId === content.content_id
                              }
                              className="shrink-0 p-2 text-red-400 hover:bg-red-600/20 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>

                          {/* Media Files Preview */}
                          {content.contents && content.contents.length > 0 && (
                            <div className="space-y-2 mt-1 max-w-sm">
                              {content.contents.map((file) => {
                                const fileType = getFileIcon(file.filepath);
                                return (
                                  <div
                                    key={file.file_id}
                                    className="flex flex-col gap-1 bg-dark-700/50 rounded p-2"
                                  >
                                    {/* File Header */}
                                    <div className="flex items-center gap-2">
                                      {fileType === "image" ? (
                                        <Image className="w-4 h-4 text-burgundy-400 shrink-0" />
                                      ) : fileType === "video" ? (
                                        <Video className="w-4 h-4 text-blue-400 shrink-0" />
                                      ) : (
                                        <FileText className="w-4 h-4 text-gray-400 shrink-0" />
                                      )}
                                      <p className="text-xs text-gray-300 truncate flex-1">
                                        {file.filepath?.split("/").pop() ||
                                          "File"}
                                      </p>
                                    </div>

                                    {/* Media Preview */}
                                    {fileType === "image" && file.filepath && (
                                      <div className="flex justify-center">
                                        <img
                                          src={file.filepath}
                                          alt={
                                            file.filepath?.split("/").pop() ||
                                            "Image"
                                          }
                                          className="max-h-20 object-contain rounded"
                                        />
                                      </div>
                                    )}
                                    {fileType === "video" && file.filepath && (
                                      <div className="flex justify-center">
                                        <video
                                          src={file.filepath}
                                          controls
                                          className="max-h-20 rounded bg-black object-contain"
                                        />
                                      </div>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-400 text-center py-3">
                      No contents in this board
                    </p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
