import { Send, X } from "lucide-react";

interface InputContentCommentComponentProps {
  commentText: string;
  profile: string;
  replyingTo: number | null;
  replyingToComment: { id: number; text: string } | null;
  onCommentChange: (text: string) => void;
  onCommentSubmit: (parentId: number | null) => void;
  onCancelReply: () => void;
}

export function InputContentCommentComponent({
  commentText,
  profile,
  replyingTo,
  replyingToComment,
  onCommentSubmit,
  onCommentChange,
  onCancelReply,
}: InputContentCommentComponentProps) {
  return (
    <div className="border-b border-dark-700 p-3">
      {replyingToComment && (
        <div className="mb-3 p-2 bg-dark-700 rounded border-l-2 border-burgundy-600 flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <p className="text-xs text-burgundy-400 font-semibold">
              Replying to:
            </p>
            <p className="text-xs text-gray-300 truncate">
              {replyingToComment.text}
            </p>
          </div>
          <button
            onClick={onCancelReply}
            className="text-gray-400 hover:text-gray-300 transition-colors shrink-0"
          >
            <X size={16} />
          </button>
        </div>
      )}
      <div className="flex items-center gap-2">
        <img src={profile} alt="Your avatar" className="w-8 h-8 rounded-full" />
        <div className="flex-1 flex items-center gap-2 bg-dark-700 rounded-full px-3 py-2">
          <input
            type="text"
            value={commentText}
            onChange={(e) => onCommentChange(e.target.value)}
            placeholder="Add a comment..."
            className="flex-1 bg-transparent text-white text-xs placeholder-gray-500 outline-none"
          />
          <button
            className="text-burgundy-500 hover:text-burgundy-400 transition-colors"
            onClick={() => {
              onCommentSubmit(replyingTo);
            }}
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
