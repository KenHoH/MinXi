import { Send } from "lucide-react";

interface InputContentCommentComponentProps {
  commentText: string;
  onCommentChange: (text: string) => void;
}

export function InputContentCommentComponent({
  commentText,
  onCommentChange,
}: InputContentCommentComponentProps) {
  return (
    <div className="border-b border-dark-700 p-3">
      <div className="flex items-center gap-2">
        <img
          src={`/api/placeholder?size=32&text=You`}
          alt="Your avatar"
          className="w-8 h-8 rounded-full"
        />
        <div className="flex-1 flex items-center gap-2 bg-dark-700 rounded-full px-3 py-2">
          <input
            type="text"
            value={commentText}
            onChange={(e) => onCommentChange(e.target.value)}
            placeholder="Add a comment..."
            className="flex-1 bg-transparent text-white text-xs placeholder-gray-500 outline-none"
          />
          <button className="text-burgundy-500 hover:text-burgundy-400 transition-colors">
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
