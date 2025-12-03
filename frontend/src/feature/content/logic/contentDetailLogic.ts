import type { UserDto, BoardDto, FullContentDto } from "@/service/api";

// ============= STATE INITIALIZATION =============
export function initializeContentState(content: FullContentDto) {
  return {
    currentMediaIndex: 0,
    showReportModal: false,
    showPinModal: false,
    refreshComments: false,
    liked: false,
    pinned: false,
    reported: false,
    followed: false,
    isOwnContent: false,
    commentText: "",
    replyingToCommentId: null as number | null,
    replyingToComment: null as { id: number; text: string } | null,
    currentContent: content,
    totalLikes: content.likes,
    totalPins: content.pins,
    totalReports: content.reports,
    userBoards: [] as BoardDto[],
    pinnedBoardId: null as number | null,
  };
}

// ============= COMMENT LOGIC =============
/**
 * Validates comment input before submission
 * @returns true if valid, false otherwise
 */
export function validateComment(commentText: string): boolean {
  return commentText.trim().length > 0;
}

/**
 * Prepares comment data for submission
 * @param parentId - Parent comment ID if replying, null for top-level
 * @param contentId - Content being commented on
 * @param commentText - Comment text
 * @param userId - User creating the comment
 */
export function prepareCommentData(
  parentId: number | null,
  contentId: number,
  commentText: string,
  userId: string
) {
  return {
    content_id: contentId,
    parent_id: parentId ? parentId : 0,
    text: commentText,
    creator_id: userId,
    id: 0,
  };
}

// ============= MEDIA NAVIGATION =============
export function handlePrevMedia(
  currentIndex: number,
  totalMedia: number
): number {
  return currentIndex === 0 ? totalMedia - 1 : currentIndex - 1;
}

export function handleNextMedia(
  currentIndex: number,
  totalMedia: number
): number {
  return currentIndex === totalMedia - 1 ? 0 : currentIndex + 1;
}

// ============= LIKE LOGIC =============
export async function handleLikeLogic(
  liked: boolean,
  contentId: number,
  creatorId: string,
  userId: string,
  areaId: number,
  updateLike: Function,
  updateLikeUser: Function,
  upsert: Function,
  pinned: boolean
) {
  const newLiked = !liked;

  // Update like counts
  await updateLike(contentId, areaId, { delta: newLiked ? 1 : -1 });
  await updateLikeUser(creatorId, { delta: newLiked ? 1 : -1 });

  // Update history
  await upsert({
    content_id: contentId,
    user_id: userId,
    liked: newLiked,
    pinned,
    reps: 0,
  });

  return newLiked;
}

// ============= REPORT LOGIC =============
export async function handleReportLogic(
  reported: boolean,
  contentId: number,
  creatorId: string,
  userId: string,
  areaId: number,
  updateReport: Function,
  updateReportUser: Function,
  upsert: Function,
  liked: boolean,
  pinned: boolean
) {
  const newReport = !reported;

  // Update report counts
  await updateReport(contentId, areaId, { delta: newReport ? 1 : -1 });
  await updateReportUser(creatorId, { delta: newReport ? 1 : -1 });

  // Update history
  await upsert({
    content_id: contentId,
    user_id: userId,
    liked,
    pinned,
    reps: 0,
  });

  return newReport;
}

// ============= CONTENT OWNERSHIP =============
export function checkIsOwnContent(
  userId: string | undefined,
  creatorId: string
): boolean {
  return userId === creatorId;
}

// ============= FOLLOW LOGIC =============
export function updateFollowState(currentFollowed: boolean): boolean {
  return !currentFollowed;
}
