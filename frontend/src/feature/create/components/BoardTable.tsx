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
import { BoardCard } from "./BoardCard";

interface BoardTableProps {
  items: BoardDto[];
  onDelete: (id: number) => void;
  onRefresh?: () => void;
}

export function BoardTable({
  items: initialItems,
  onDelete,
  onRefresh,
}: BoardTableProps) {
  const [boards, setBoards] = useState(initialItems);
  const [showCreateModal, setShowCreateModal] = useState(false);
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
      setBoards(boards.filter((b) => b.board_id !== boardId));
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
      if (!user) {
        showToast("User not authenticated");
        return;
      }

      await removeContent(boardId, user.area_id, {
        content_id: contentId,
      });

      setBoards(
        boards.map((board) =>
          board.board_id === boardId
            ? {
                ...board,
                contents:
                  board.contents?.filter((c) => c.content_id !== contentId) ||
                  [],
              }
            : board
        )
      );

      showToast("Content removed from board");
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
        onClose={() => {
          setShowCreateModal(false);
          onRefresh && onRefresh();
        }}
        currentUserId={currentUserId}
        onBoardCreated={onRefresh && (() => onRefresh())}
      />

      {boards.length === 0 ? (
        <div className="text-center py-12 bg-dark-800 rounded-lg border border-dark-700 ">
          <p className="text-gray-400">No boards created yet</p>
        </div>
      ) : (
        <div className="space-y-2 max-h-full overflow-y-auto">
          {boards.map((board) => (
            <BoardCard
              formatDate={formatDate}
              deletingId={deletingId}
              getFileIcon={getFileIcon}
              handleDeleteBoard={handleDeleteBoard}
              handleRemoveContent={handleRemoveContent}
              removingContentId={removingContentId}
              key={board.board_id}
              board={board}
            />
          ))}
        </div>
      )}
    </div>
  );
}
