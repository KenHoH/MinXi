import { X, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Masonry } from "@/shared/components/Masonry";
import { ContentComponent } from "@/feature/content/components/ContentComponent/ContentComponent";
import { PostComponent } from "@/feature/content/components/PostComponent/PostComponent";
import { useState } from "react";
import type Board from "@/feature/content/object/Board";

interface BoardModalProps {
  board: Board;
  onClose: () => void;
  onDelete: (boardId: number) => void;
  onRemoveItem?: (contentId: number) => void;
  showDeleteButton?: boolean;
  canRemoveItems?: boolean;
}

export function BoardModal({
  board,
  onClose,
  onDelete,
  onRemoveItem,
  showDeleteButton = true,
  canRemoveItems = true,
}: BoardModalProps) {
  const [contents, setContents] = useState(board.contents);

  const handleRemoveItem = (contentId: number) => {
    setContents((prev) => prev.filter((item) => item.content_id !== contentId));
    onRemoveItem?.(contentId);
  };
  const handleClickOutside = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement)?.id === "board-modal-backdrop") {
      onClose();
    }
  };

  return (
    <div
      id="board-modal-backdrop"
      onClick={handleClickOutside}
      className="fixed inset-0 bg-black flex items-center justify-center z-50 p-4"
    >
      <div className="bg-dark-800 rounded-lg overflow-hidden w-full max-w-4xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="border-b border-dark-700 p-6 flex items-start justify-between">
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-100 mb-2">
              {board.title}
            </h2>
            <p className="text-gray-400 text-sm mb-3">{board.description}</p>
            <div className="flex gap-4 text-xs text-gray-500">
              <span>{contents.length} items</span>
              <span>{board.visibilityPrivate ? "Private" : "Public"}</span>
              <span>by creator #{board.creator_id}</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-200 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6">
          {contents.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p>This board is empty</p>
            </div>
          ) : (
            <Masonry columns={4}>
              {contents.map((item) => (
                <div key={item.content_id} className="relative group">
                  {item.post_type === "post" ? (
                    <PostComponent post={item} />
                  ) : (
                    <ContentComponent content={item} />
                  )}
                  <button
                    onClick={() => handleRemoveItem(item.content_id)}
                    className={`absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white rounded-full p-2 transition-opacity z-10 ${
                      canRemoveItems
                        ? "opacity-0 group-hover:opacity-100"
                        : "hidden"
                    }`}
                    title="Remove from board"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </Masonry>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-dark-700 p-6 flex justify-end gap-3">
          <Button
            variant="outline"
            onClick={onClose}
            className="text-gray-300 border-dark-600 hover:bg-dark-700"
          >
            Close
          </Button>
          {showDeleteButton && (
            <Button
              onClick={() => {
                onDelete(board.board_id);
                onClose();
              }}
              className="bg-red-600 hover:bg-red-700 text-white flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Delete Board
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
