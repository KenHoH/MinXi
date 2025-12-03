export const handleComment = async (
  parentId: number | null,
  contentId: number,
  commentText: string,
  userId: number,
  areaId: number,
  updateComment: Function,
  create: Function,
  showToast: Function
) => {
  // Validate input
  if (!commentText || commentText.trim().length === 0) {
    showToast("Comment cannot be empty", "", "warning");
    return false;
  }

  try {
    // Update comment count on backend
    await updateComment(contentId, areaId, { delta: 1 });

    // Create new comment
    await create({
      content_id: contentId,
      parent_id: parentId ? parentId : 0,
      text: commentText.trim(),
      creator_id: userId,
      id: 0,
    });

    showToast("Comment added successfully", "", "success");
    return true;
  } catch (error) {
    console.error("Failed to create comment:", error);
    showToast("Failed to add comment", "", "error");
    return false;
  }
};
