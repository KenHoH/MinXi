import type { CommentFullRes } from "@/service/api";
import { useEffect, useState, useCallback, useMemo, memo } from "react";
import { ChevronDown, ChevronUp, MessageCircle } from "lucide-react";
import useCommentService from "@/shared/hooks/useCommentService";

interface CommentParentComponentProps {
  contentId: number;
  replyingTo: number | null;
  onReplySelect?: (commentId: number, commentText: string) => void;
  refresh: boolean;
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
  comment: CommentFullRes;
  level: number;
  replyingTo: number | null;
  onReplySelect?: (commentId: number, commentText: string) => void;
}

const CommentItem = memo(
  ({ comment, level, replyingTo, onReplySelect }: CommentItemProps) => {
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
              <CommentItem
                key={reply.id}
                comment={reply}
                level={level + 1}
                replyingTo={replyingTo}
                onReplySelect={onReplySelect}
              />
            ))}
          </div>
        ) : null,
      [
        hasReplies,
        isExpanded,
        comment.replies,
        level,
        replyingTo,
        onReplySelect,
      ]
    );

    return (
      <div
        className={`space-y-2 ${
          level > 0 ? "ml-6 pl-3 border-l border-dark-600" : ""
        }`}
      >
        <div className="flex gap-3">
          <img
            src={comment.creator.profile_picture}
            alt="Commenter"
            className="w-8 h-8 rounded-full shrink-0"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="font-semibold text-sm text-gray-100">
                @{comment.creator.username}
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
            <button
              onClick={() => onReplySelect?.(comment.id, comment.text)}
              className={`inline-flex items-center gap-1 text-xs mt-2 transition-colors ${
                replyingTo === comment.id
                  ? "text-burgundy-400"
                  : "text-gray-400 hover:text-burgundy-400"
              }`}
            >
              <MessageCircle
                size={14}
                className="hover:text-red-400 transition-colors"
              />
              Reply
            </button>
          </div>
        </div>

        {/* Nested Replies */}
        {nestedComments}
      </div>
    );
  }
);

CommentItem.displayName = "CommentItem";

export function CommentParentComponent({
  contentId,
  replyingTo,
  onReplySelect,
  refresh,
}: CommentParentComponentProps) {
  const [comments, setComments] = useState<CommentFullRes[]>([]);
  const { getComment } = useCommentService();

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await getComment(contentId);
        if (res) {
          setComments(res);
        }
      } catch (error) {
        console.error("Failed to fetch comments:", error);
      }
    };
    fetchComments();
  }, [contentId, refresh]);

  const commentElements = useMemo(
    () =>
      comments.length === 0 ? (
        <div className="text-center py-8 text-gray-400">
          No comments yet. Be the first to comment!
        </div>
      ) : (
        comments.map((comment) => (
          <CommentItem
            key={comment.id}
            comment={comment}
            level={0}
            replyingTo={replyingTo}
            onReplySelect={onReplySelect}
          />
        ))
      ),
    [comments, replyingTo, onReplySelect]
  );

  return <div className="space-y-4">{commentElements}</div>;
}
