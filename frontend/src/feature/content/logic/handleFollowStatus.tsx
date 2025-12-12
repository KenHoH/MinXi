const checkFollowStatus = async (
  userId: number | null,
  isOwnContent: boolean,
  post: { creator_id: number },
  setIsOwnContent: React.Dispatch<React.SetStateAction<boolean>>,
  setFollowed: React.Dispatch<React.SetStateAction<boolean>>,
  checkFollow: (creatorId: number, userId: number) => Promise<boolean | null>
) => {
  if (!userId || isOwnContent) {
    setFollowed(false);
    return;
  }
  if (userId === post.creator_id) {
    setIsOwnContent(true);
    setFollowed(false);
    return;
  }

  try {
    const isFollowing = await checkFollow(post.creator_id, userId);
    setFollowed(isFollowing || false);
  } catch (error) {
    console.error("Failed to check follow status:", error);
    setFollowed(false);
  }
};

export default checkFollowStatus;
