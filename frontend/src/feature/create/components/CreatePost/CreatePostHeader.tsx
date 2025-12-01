import { X } from "lucide-react";

interface CreatePostHeaderProps {
  parentPostId?: number;
  onClose: () => void;
}

export function CreatePostHeader({
  parentPostId,
  onClose,
}: CreatePostHeaderProps) {
  return (
    <div className="flex items-center justify-between p-6 border-b border-dark-700">
      <h2 className="text-xl font-bold text-gray-100">
        {parentPostId ? "Reply to Post" : "Create Post"}
      </h2>
      <button
        onClick={onClose}
        className="p-2 hover:bg-dark-700 rounded-full transition-colors"
      >
        <X className="w-6 h-6 text-gray-300" />
      </button>
    </div>
  );
}
