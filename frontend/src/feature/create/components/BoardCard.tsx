import { useState } from "react";
import {
  Trash2,
  ChevronDown,
  ChevronRight,
  FileText,
  Package,
  Calendar,
} from "lucide-react";

import type { BoardDto } from "@/service/api";

interface BoardCardProps {
  board: BoardDto;
  deletingId: number | null;
  removingContentId: number | null;
  handleDeleteBoard: (boardId: number) => Promise<void> | void;
  handleRemoveContent: (
    boardId: number,
    contentId: number
  ) => Promise<void> | void;
  formatDate: (date: string) => string;
  getFileIcon: (filepath: string) => "image" | "video" | "file";
}

export function BoardCard({
  board,
  deletingId,
  removingContentId,
  handleDeleteBoard,
  handleRemoveContent,
  formatDate,
  getFileIcon,
}: BoardCardProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-dark-800 rounded-lg border border-dark-700 overflow-hidden hover:border-burgundy-600/50 transition-colors">
      {/* Header */}
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
          </div>

          {/* Delete Board */}
          <button
            onClick={() => handleDeleteBoard(board.board_id)}
            disabled={deletingId === board.board_id}
            className="shrink-0 p-2 text-red-400 hover:bg-red-600/20 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Toggle */}
      <button
        onClick={() => setExpanded((prev) => !prev)}
        className="w-full px-4 sm:px-6 py-3 border-t border-dark-700 bg-dark-750 hover:bg-dark-700 transition-colors flex items-center justify-between text-sm font-medium text-gray-300"
      >
        <span className="flex items-center gap-2">
          {expanded ? (
            <ChevronDown className="w-4 h-4" />
          ) : (
            <ChevronRight className="w-4 h-4" />
          )}
          Contents
        </span>
      </button>

      {/* Expanded Contents */}
      {expanded && (
        <div className="px-4 sm:px-6 py-4 border-t border-dark-700 bg-dark-750">
          {board.contents && board.contents.length > 0 ? (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {board.contents.map((content) => (
                <div
                  key={content.content_id}
                  className="flex items-start gap-2 p-2 bg-dark-800 rounded border border-dark-700/50 hover:border-burgundy-600/50 transition-colors"
                >
                  {/* Thumbnail */}
                  {content.contents && content.contents.length > 0 && (
                    <div className="shrink-0">
                      {(() => {
                        const file = content.contents[0];
                        const type = getFileIcon(file.filepath);

                        if (type === "image")
                          return (
                            <img
                              src={file.filepath}
                              className="w-12 h-12 object-cover rounded"
                            />
                          );

                        if (type === "video")
                          return (
                            <video
                              src={file.filepath}
                              className="w-12 h-12 object-cover rounded bg-black"
                            />
                          );

                        return (
                          <div className="w-12 h-12 flex items-center justify-center rounded bg-dark-700">
                            <FileText className="w-5 h-5 text-gray-400" />
                          </div>
                        );
                      })()}
                    </div>
                  )}

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-100 font-medium truncate">
                      {content.title}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {content.description || "No description"}
                    </p>
                  </div>

                  {/* Remove content */}
                  <button
                    onClick={() =>
                      handleRemoveContent(board.board_id, content.content_id)
                    }
                    disabled={removingContentId === content.content_id}
                    className="shrink-0 p-1 text-red-400 hover:bg-red-600/20 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    ×
                  </button>
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
  );
}
