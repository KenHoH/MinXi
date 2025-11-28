import type { CommentRes } from "@/service/api";
import { useEffect, useState, useCallback, useMemo, memo } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import useCommentService from "@/shared/hooks/useCommentService";

interface CommentParentComponentProps {
  contentId: number;
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;

  return date.toLocaleDateString();
};

interface CommentItemProps {
  comment: CommentRes;
  level: number;
}

const CommentItem = memo(({ comment, level }: CommentItemProps) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const hasReplies = useMemo(
    () => comment.replies && comment.replies.length > 0,
    [comment.replies]
  );

  const handleToggle = useCallback(() => {
    setIsExpanded((prev) => !prev);
  }, []);

  const formattedDate = useMemo(
    () => formatDate(comment.created_at),
    [comment.created_at]
  );

  const nestedComments = useMemo(
    () =>
      hasReplies && isExpanded ? (
        <div className="space-y-3 mt-3">
          {comment.replies.map((reply) => (
            <CommentItem key={reply.id} comment={reply} level={level + 1} />
          ))}
        </div>
      ) : null,
    [hasReplies, isExpanded, comment.replies, level]
  );

  return (
    <div
      className={`space-y-2 ${
        level > 0 ? "ml-6 pl-3 border-l border-dark-600" : ""
      }`}
    >
      <div className="flex gap-3">
        <img
          src={`/api/placeholder?size=32&text=U${comment.creator_id}`}
          alt="Commenter"
          className="w-8 h-8 rounded-full shrink-0"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="font-semibold text-sm text-gray-100">
              @user{comment.creator_id}
            </span>
            <span className="text-xs text-gray-400">{formattedDate}</span>
            {hasReplies && (
              <button
                onClick={handleToggle}
                className="ml-auto inline-flex items-center gap-1 text-xs text-burgundy-400 hover:text-burgundy-300 transition-colors"
              >
                {isExpanded ? (
                  <>
                    <ChevronUp size={14} />
                    Hide
                  </>
                ) : (
                  <>
                    <ChevronDown size={14} />
                    {comment.replies.length}{" "}
                    {comment.replies.length === 1 ? "reply" : "replies"}
                  </>
                )}
              </button>
            )}
          </div>
          <p className="text-sm text-gray-300 wrap-break-word">
            {comment.text}
          </p>
        </div>
      </div>

      {/* Nested Replies */}
      {nestedComments}
    </div>
  );
});

CommentItem.displayName = "CommentItem";

export function CommentParentComponent({
  contentId,
}: CommentParentComponentProps) {
  const [comments, setComments] = useState<CommentRes[]>([]);
  const { getComment } = useCommentService();

  useEffect(() => {
    const fetchComments = async () => {
      const result = await getComment(contentId);
      if (result) {
        setComments(result);
      }
    };
    fetchComments();
  }, [contentId, getComment]);

  const commentElements = useMemo(
    () =>
      comments.map((comment) => (
        <CommentItem key={comment.id} comment={comment} level={0} />
      )),
    [comments]
  );

  return <div className="space-y-4">{commentElements}</div>;
}
