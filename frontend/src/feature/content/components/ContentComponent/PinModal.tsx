import type { BoardDto, FullContentDto, UserDto } from "@/service/api";
import { useToast } from "@/shared/context/ToastContext";
import { useAuthContext } from "@/feature/auth/context/AuthContext";
import { X, Pin } from "lucide-react";
import { useState } from "react";
import useBoardService from "@/shared/hooks/useBoardService";

interface PinModalProps {
  isOpen: boolean;
  onClose: () => void;
  content: FullContentDto;
  userBoards: BoardDto[];
  onPinSuccess: (boardId: number) => void;
}

export default function PinModal({
  isOpen,
  onClose,
  content,
  userBoards,
  onPinSuccess,
}: PinModalProps) {
  const { user } = useAuthContext();
  const { showToast } = useToast();

  const [selectedBoard, setSelectedBoard] = useState<number | null>(null);
  const [pinLoading, setPinLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const { addContent } = useBoardService();

  const handleBoardSelect = (boardId: number) => {
    setSelectedBoard(boardId);
  };

  const handleConfirmPin = async () => {
    if (selectedBoard === null || !user) {
      setError("Please select a board");
      return;
    }

    setPinLoading(true);
    try {
      setError("");

      // Add content to the selected board
      await addContent(selectedBoard, user.area_id, {
        content_id: content.content_id,
      });

      console.log("Content pinned to board:", selectedBoard);
      showToast("Content pinned successfully");
      handleClose();
      onPinSuccess(selectedBoard);
    } catch (err) {
      console.error("Failed to pin content:", err);
      setError("Failed to pin content. Please try again.");
      showToast("Failed to pin content");
    } finally {
      setPinLoading(false);
    }
  };

  const handleClose = () => {
    setSelectedBoard(null);
    setError("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-60 p-4">
      <div className="bg-black rounded-lg max-w-md w-full shadow-xl border border-dark-700">
        <div className="flex items-center justify-between p-6 border-b border-dark-700">
          <div className="flex items-center gap-2">
            <Pin className="w-5 h-5 text-burgundy-500" />
            <h2 className="text-lg font-semibold text-white">Pin to Board</h2>
          </div>
          <button
            onClick={handleClose}
            disabled={pinLoading}
            className="p-1 hover:bg-dark-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-3">
              Select a Board
            </label>
            <div className="space-y-2">
              {userBoards.length > 0 ? (
                userBoards.map((board) => (
                  <button
                    key={board.board_id}
                    onClick={() => handleBoardSelect(board.board_id)}
                    disabled={pinLoading}
                    className={`w-full text-left p-3 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3 ${
                      selectedBoard === board.board_id
                        ? "bg-burgundy-900 border-2 border-burgundy-500"
                        : "bg-dark-700 border-2 border-transparent hover:border-dark-600"
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${
                        selectedBoard === board.board_id
                          ? "bg-burgundy-500 border-burgundy-500"
                          : "border-gray-400"
                      }`}
                    >
                      {selectedBoard === board.board_id && (
                        <span className="text-white text-xs">✓</span>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-white">{board.title}</p>
                      <p className="text-xs text-gray-400">
                        {board.contents?.length || 0} items
                      </p>
                    </div>
                  </button>
                ))
              ) : (
                <p className="text-sm text-gray-400">
                  You haven't created any boards yet
                </p>
              )}
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-900 border border-red-700 rounded-lg">
              <p className="text-sm text-red-300">{error}</p>
            </div>
          )}
        </div>

        <div className="flex gap-3 p-6 border-t border-dark-700">
          <button
            onClick={handleClose}
            disabled={pinLoading}
            className="flex-1 px-4 py-2 bg-dark-700 text-gray-200 rounded-lg hover:bg-dark-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirmPin}
            disabled={pinLoading || selectedBoard === null}
            className="flex-1 px-4 py-2 bg-burgundy-600 text-white rounded-lg hover:bg-burgundy-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            {pinLoading ? "Pinning..." : "Confirm Pin"}
          </button>
        </div>
      </div>
    </div>
  );
}
