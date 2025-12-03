import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { CreatePostModal } from "../../../create/components/CreatePost/CreatePostModal";
import { PostDetailHeader } from "./PostDetailHeader";
import { PostDetailMain } from "./PostDetailMain";
import { PostMediaGallery } from "./PostMediaGallery";
import { MiniPostDetail } from "./MiniPostDetail";
import type { BoardDto, FullContentDto, UserDto } from "@/service/api";
import useContentService from "@/shared/hooks/useContentService";
import useUserService from "@/shared/hooks/useUserService";
import useHistoryService from "@/shared/hooks/useHistoryService";
import { useAuthContext } from "@/feature/auth/context/AuthContext";
import { ReportModal } from "../ContentComponent/ReportModal";
import { useToast } from "@/shared/context/ToastContext";
import useBoardService from "@/shared/hooks/useBoardService";
import PinModal from "../ContentComponent/PinModal";
import useConnectionService from "@/shared/hooks/useConnectionService";

interface PostDetailComponentProps {
  post: FullContentDto;
  onClose: () => void;
  ancestors: FullContentDto[] | null;
  children: FullContentDto[] | null;
  onRefreshChild: () => void;
  onLikeClick?: (newLike: number) => void;
  onCommentClick?: (newComment: number) => void;
  onPinClick?: (newPin: number) => void;
  onLiked: (liked: boolean) => void;
}

export function PostDetailComponent({
  post,
  onClose,
  ancestors,
  children,
  onRefreshChild,
  onLikeClick,
  onCommentClick,
  onPinClick,
  onLiked,
}: PostDetailComponentProps) {
  const { user } = useAuthContext();
  const { showToast } = useToast();
  const [liked, setLiked] = useState(false);
  const [pinned, setPinned] = useState(false);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [userData, setUserdata] = useState<UserDto | null>(null);
  const { findUserById } = useUserService();
  const [currentPost, setCurrentPost] = useState<FullContentDto>(post);
  const [totalLikes, setTotalLikes] = useState(post.likes);
  const [totalPins, setTotalPins] = useState(post.pins);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showPinModal, setShowPinModal] = useState(false);
  const [followed, setFollowed] = useState(false);
  const [isOwnContent, setIsOwnContent] = useState(false);
  const [reported, setReported] = useState(false);
  const [userBoards, setUserBoards] = useState<BoardDto[]>([]);
  const [pinnedBoardId, setPinnedBoardId] = useState<number | null>(null);
  const { upsert, getByUserAndContent } = useHistoryService();
  const { getBoardByUser, removeContent } = useBoardService();
  const {
    updateLike,
    updatePin,
    updateComment,
    findOne,
    getAncestorPost,
    getChildPost,
  } = useContentService();
  const { updateLikeUser, updateFollowUser, updateReportUser } =
    useUserService();
  const { checkFollow, createFollow, deleteFollow } = useConnectionService();

  const handlePrevMedia = () => {
    setCurrentMediaIndex((prev) =>
      prev === 0 ? currentPost.contents.length - 1 : prev - 1
    );
  };

  const handleNextMedia = () => {
    setCurrentMediaIndex((prev) =>
      prev === currentPost.contents.length - 1 ? 0 : prev + 1
    );
  };

  const getBoards = async () => {
    if (!userData) return;
    const boards = await getBoardByUser(userData.user_id, userData.area_id);
    setUserBoards(boards || []);

    // Find which board contains this content if pinned
    if (pinned && boards) {
      for (const board of boards) {
        if (board.contents?.some((c) => c.content_id === post.content_id)) {
          setPinnedBoardId(board.board_id);
          break;
        }
      }
    }
  };

  const updateBoardsWithContent = (boardId: number) => {
    setPinnedBoardId(boardId);
  };

  const handleClickOutside = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement)?.id === "post-detail-backdrop") {
      onClose();
    }
  };

  const getHistory = async () => {
    if (!user) return;
    const res = await getByUserAndContent(user.user_id, post.content_id);
    if (res) {
      console.log("History fetched:", res);
      setLiked(res.liked);
      setPinned(res.pinned);
    }
  };

  const handleFollow = async (isFollowing: boolean) => {
    if (!user) return;

    try {
      if (isFollowing) {
        await deleteFollow(post.creator_id, user.user_id);
        await updateFollowUser(post.creator_id, { delta: -1 });
      } else {
        await createFollow(post.creator_id, user.user_id);
        await updateFollowUser(post.creator_id, { delta: 1 });
      }
    } catch (error) {
      console.error("Failed to handle follow:", error);
    }
  };

  const handleBtn = async (typeBtn: number) => {
    if (!user) return;
    switch (typeBtn) {
      case 1: {
        const newLiked = !liked;
        await updateLike(post.content_id, userData?.area_id || 0, {
          delta: newLiked ? 1 : -1,
        });
        await updateLikeUser(post.creator_id, { delta: newLiked ? 1 : -1 });
        setLiked(newLiked);
        setTotalLikes((prev) => prev + (newLiked ? 1 : -1));
        await upsert({
          content_id: post.content_id,
          user_id: user.user_id,
          liked: newLiked,
          pinned,
          reps: 0,
        });
        onLiked(newLiked);
        break;
      }
      case 2: {
        if (pinned) {
          // Unpin: Remove content from the board
          await handleUnpin();
        } else {
          // Pin: Show modal to select a board
          setShowPinModal(true);
        }
        break;
      }
      case 3: {
        await updateComment(post.content_id, userData?.area_id || 0, {
          delta: 1,
        });
        break;
      }
    }
  };

  const handleUnpin = async () => {
    if (!user || !userData || pinnedBoardId === null) return;

    try {
      // Remove content from the board
      await removeContent(pinnedBoardId, userData.area_id, {
        content_id: post.content_id,
      });

      // Update pin count
      await updatePin(post.content_id, userData.area_id, {
        delta: -1,
      });

      // Update state
      setTotalPins((prev) => prev - 1);
      setPinned(false);
      setPinnedBoardId(null);

      await upsert({
        content_id: post.content_id,
        user_id: user.user_id,
        liked,
        pinned: false,
        reps: 0,
      });

      showToast("Content unpinned successfully");
    } catch (error) {
      console.error("Failed to unpin content:", error);
      showToast("Failed to unpin content");
    }
  };

  const fetchUserData = async (userId: number) => {
    try {
      const response = await findUserById(userId);
      if (response) setUserdata(response);
    } catch (error) {
      console.error("Failed to fetch user data:", error);
    }
  };

  const updateReport = async (delta: boolean) => {
    if (!user) return;
    await updateReportUser(post.creator_id, { delta: delta ? 1 : -1 });
  };

  useEffect(() => {
    const fetchFreshPost = async () => {
      try {
        const freshData = await findOne(post.content_id, post.area_id);
        if (freshData) {
          setCurrentPost(freshData);
          setTotalLikes(freshData.likes);
          setTotalPins(freshData.pins);

          if (onLikeClick) onLikeClick(freshData.likes);
          if (onCommentClick) onCommentClick(freshData.comments);
          if (onPinClick) onPinClick(freshData.pins);
        }
      } catch (error) {
        console.error("Failed to fetch updated post:", error);
      }
    };
    fetchFreshPost();
  }, [post.content_id, post.area_id]);

  useEffect(() => {
    fetchUserData(post.creator_id);
    getHistory();

    // Check if this is the user's own content
    if (user?.user_id === post.creator_id) {
      setIsOwnContent(true);
    } else {
      setIsOwnContent(false);
    }
  }, [post.creator_id, post, user?.user_id]);

  // Check follow status if not own content
  useEffect(() => {
    const checkFollowStatus = async () => {
      if (!user || isOwnContent) {
        setFollowed(false);
        return;
      }

      try {
        const isFollowing = await checkFollow(post.creator_id, user.user_id);
        setFollowed(isFollowing || false);
      } catch (error) {
        console.error("Failed to check follow status:", error);
        setFollowed(false);
      }
    };

    checkFollowStatus();
  }, [user, post.creator_id, isOwnContent]);

  useEffect(() => {
    getBoards();
  }, [userData]);

  useEffect(() => {
    const refetchPostTree = async () => {
      try {
        const ancestorData = await getAncestorPost(
          post.content_id,
          post.area_id
        );
        if (ancestorData) return ancestorData;
      } catch (error) {
        console.error("Failed to fetch ancestors:", error);
      }
    };

    const refetchChildren = async () => {
      try {
        const childData = await getChildPost(post.content_id);
        if (childData) return childData;
      } catch (error) {
        console.error("Failed to fetch children:", error);
      }
    };

    // Only refetch if not already provided
    if (!ancestors || ancestors.length === 0) {
      refetchPostTree();
    }
    if (!children || children.length === 0) {
      refetchChildren();
    }
  }, [post.content_id, post.area_id]);

  // Reset media index when post changes
  useEffect(() => {
    setCurrentMediaIndex(0);
  }, [post.content_id]);

  return (
    <div
      id="post-detail-backdrop"
      onClick={handleClickOutside}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
    >
      <div className="bg-black/80 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-black rounded-full hover:bg-black text-white z-10"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="p-6 space-y-4">
          {ancestors && ancestors.length > 0 && (
            <div className="space-y-2 pb-4 border-b border-dark-700">
              <h4 className="text-xs font-semibold text-gray-400 uppercase">
                Replying to:
              </h4>
              <div className="space-y-2">
                {ancestors.map((ancestor, index) => (
                  <div key={ancestor.content_id}>
                    <MiniPostDetail post={ancestor} />
                    {index < ancestors.length - 1 && (
                      <div className="h-10 w-1 bg-red-400 my-2 rounded ml-4" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          <PostMediaGallery
            mediaItems={currentPost.contents}
            currentMediaIndex={currentMediaIndex}
            onPrevMedia={handlePrevMedia}
            onNextMedia={handleNextMedia}
            title={currentPost.title}
          />

          {userData && (
            <PostDetailHeader
              creator={userData}
              followed={followed}
              isOwnContent={isOwnContent}
              onFollowClick={() => {
                setFollowed(!followed);
                handleFollow(followed);
              }}
            />
          )}

          <PostDetailMain
            title={currentPost.title}
            description={currentPost.description}
            likes={totalLikes}
            comments={currentPost.comments}
            pins={totalPins}
            liked={liked}
            pinned={pinned}
            reported={reported}
            onLikeClick={() => handleBtn(1)}
            onPinClick={() => (pinned ? handleBtn(2) : setShowPinModal(true))}
            onReportClick={() => setShowReportModal(true)}
            onReplyClick={() => setShowCreatePost(true)}
          />

          <div className="pt-4 border-t border-dark-700 space-y-4">
            <div>
              <h3 className="font-semibold text-gray-100 mb-4">Replies</h3>
              {children && children.length > 0 ? (
                <div className="space-y-2">
                  {children.map((child) => (
                    <MiniPostDetail key={child.content_id} post={child} />
                  ))}
                </div>
              ) : (
                <p className="text-xs text-gray-400">No replies yet</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <CreatePostModal
        post={post}
        isOpen={showCreatePost}
        onRefreshChild={onRefreshChild}
        onClose={() => setShowCreatePost(false)}
        parentPostId={post.content_id}
        currentUserId={user ? user.user_id : 0}
        currentAreaId={post.area_id}
        onUpdateComment={() => handleBtn(3)}
      />
      <ReportModal
        isOpen={showReportModal}
        onClose={() => setShowReportModal(false)}
        content={post}
        loggedUserData={userData}
        onReportSuccess={() => {
          setReported(true);
          updateReport(true);
        }}
      />

      <PinModal
        isOpen={showPinModal}
        onClose={() => setShowPinModal(false)}
        content={post}
        loggedUserData={userData}
        userBoards={userBoards}
        onPinSuccess={async (boardId) => {
          if (!user) return;
          try {
            // Update pin count
            await updatePin(post.content_id, userData?.area_id || 0, {
              delta: 1,
            });

            // Upsert history
            await upsert({
              content_id: post.content_id,
              user_id: user.user_id,
              liked,
              pinned: true,
              reps: 0,
            });

            updateBoardsWithContent(boardId);
            setPinned(true);
            setTotalPins((prev) => prev + 1);
            setShowPinModal(false);
          } catch (error) {
            console.error("Failed to complete pin:", error);
            showToast("Failed to complete pin");
          }
        }}
      />
    </div>
  );
}
