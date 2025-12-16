import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { CreatePostModal } from "../../../create/components/CreatePost/CreatePostModal";
import { PostDetailHeader } from "./PostDetailHeader";
import { PostDetailMain } from "./PostDetailMain";
import { PostMediaGallery } from "./PostMediaGallery";
import { MiniPostDetail } from "./MiniPostDetail";
import type { BoardDto, FullContentDto } from "@/service/api";
import { useAuthContext } from "@/feature/auth/context/AuthContext";
import { ReportModal } from "../ContentComponent/ReportModal";
import { useToast } from "@/shared/context/ToastContext";
import PinModal from "../ContentComponent/PinModal";
import handleLike from "../../logic/handleLike";
import { handleUnpin } from "../../logic/handleUnpin";
import { handlePinSuccess } from "../../logic/handlePinSuccess";
import updateReport from "../../logic/handleReport";
import handleFollow from "../../logic/handleFollow";
import handleComment from "../../logic/handleComment";
import { getBoards } from "../../logic/handleGetBoards";
import checkFollowStatus from "../../logic/handleFollowStatus";
import type { FullContentWithHistoryProps } from "../models/FullContentWithHistory";
import handleGetAncestors from "../../logic/handleGetAncestors";
import handleGetChildren from "../../logic/handleGetChildren";
import useContentService from "@/shared/hooks/useContentService";
import useHistoryService from "@/shared/hooks/useHistoryService";
import useUserService from "@/shared/hooks/useUserService";
import useNotification from "@/shared/logic/useNotificatoin";
import useConnectionService from "@/shared/hooks/useConnectionService";
import useBoardService from "@/shared/hooks/useBoardService";

interface PostDetailComponentProps {
  post: FullContentDto;
  onClose: () => void;
  // ancestors: FullContentWithHistoryProps[] | null;
  // children: FullContentDto[] | null;
  liked: boolean;
  pinned: boolean;
  likes: number;
  pins: number;
  comments: number;
  onLikeClick: (newLike: number) => void;
  onCommentClick: (newComment: number) => void;
  onPinClick: (newPin: number) => void;
  onLiked: (liked: boolean) => void;
  onPinned: (pinned: boolean) => void;
  onPostNavigate?: (post: FullContentDto) => void;
}

export function PostDetailComponent(props: PostDetailComponentProps) {
  const {
    post,
    onClose,
    liked: propsLiked,
    pinned: propsPinned,
    likes: propsLikes,
    pins: propsPins,
    comments: propsComments,
    onLikeClick,
    onCommentClick,
    onPinClick,
    onLiked,
    onPinned,
    onPostNavigate,
  } = props;
  const { user } = useAuthContext();
  const { showToast } = useToast();
  const {
    updateLike,
    updateComment,
    updatePin,
    getAncestorPost,
    getChildPost,
  } = useContentService();
  const { upsert: upsertHistory, getByUser } = useHistoryService();
  const { updateLikeUser, updateFollowUser, updateReportUser } =
    useUserService();
  const { sendNotificatonSystem } = useNotification();
  const { checkFollow, createFollow, deleteFollow } = useConnectionService();
  const { getBoardByUser, removeContent } = useBoardService();

  const [liked, setLiked] = useState(propsLiked);
  const [pinned, setPinned] = useState(propsPinned);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const currentPost = post;
  const [totalLikes, setTotalLikes] = useState(propsLikes);
  const [totalComments, setTotalComments] = useState(propsComments);
  const [totalPins, setTotalPins] = useState(propsPins);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showPinModal, setShowPinModal] = useState(false);
  const [followed, setFollowed] = useState(false);
  const [isOwnContent, setIsOwnContent] = useState(false);
  const [reported, setReported] = useState(false);
  const [userBoards, setUserBoards] = useState<BoardDto[]>([]);
  const [pinnedBoardId, setPinnedBoardId] = useState<number | null>(null);
  const [ancestors, setAncestors] = useState<
    FullContentWithHistoryProps[] | null
  >(null);
  const [children, setChildren] = useState<
    FullContentWithHistoryProps[] | null
  >(null);
  const [isLoadingAncestors, setIsLoadingAncestors] = useState(true);
  const [isLoadingChildren, setIsLoadingChildren] = useState(true);

  useEffect(() => {
    setLiked(propsLiked);
    setPinned(propsPinned);
    setTotalLikes(propsLikes);
    setTotalPins(propsPins);
    setTotalComments(propsComments);
  }, [propsLiked, propsPinned, propsLikes, propsPins, propsComments]);

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
  const handleClickOutside = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement)?.id === "post-detail-backdrop") {
      onClose();
    }
  };

  const handleBtnLike = async () => {
    if (!user) return;
    await handleLike(
      liked,
      totalLikes,
      pinned,
      post.creator_id,
      user.user_id,
      post.area_id,
      post.content_id,
      setLiked,
      setTotalLikes,
      onLikeClick,
      onLiked,
      updateLike,
      updateLikeUser,
      upsertHistory,
      sendNotificatonSystem
    );
  };

  const handleBtnPin = async () => {
    if (!user) return;
    if (pinned) {
      await handleUnpin(
        post,
        user.user_id,
        user.area_id,
        pinnedBoardId,
        liked,
        setTotalPins,
        setPinned,
        setPinnedBoardId,
        onPinClick,
        onPinned,
        removeContent,
        updatePin,
        upsertHistory,
        showToast
      );
    } else {
      setShowPinModal(true);
    }
  };

  const handleBtnComment = async () => {
    if (!user) return;
    await handleComment(
      post.content_id,
      user.user_id,
      post.creator_id,
      post.area_id,
      totalComments,
      setTotalComments,
      onCommentClick,
      updateComment,
      sendNotificatonSystem
    );
  };

  const onPinSuccess = async (boardId: number) => {
    if (!user) return;
    await handlePinSuccess(
      post.content_id,
      user.user_id,
      post.area_id,
      liked,
      boardId,
      totalPins,
      setPinnedBoardId,
      setPinned,
      setTotalPins,
      setShowPinModal,
      onPinClick,
      onPinned,
      updatePin,
      upsertHistory,
      showToast
    );
  };

  const fetchAncestors = async () => {
    if (!user) return;
    setIsLoadingAncestors(true);
    try {
      const ancestorsData = await handleGetAncestors(
        post.content_id,
        post.area_id,
        user.user_id,
        getAncestorPost,
        getByUser
      );
      setAncestors(ancestorsData);
    } catch (error) {
      console.error("Error fetching ancestors:", error);
      setAncestors([]);
    } finally {
      setIsLoadingAncestors(false);
    }
  };

  const fetchChildren = async () => {
    if (!user) return;
    setIsLoadingChildren(true);
    try {
      const childrenData = await handleGetChildren(
        post.content_id,
        user.user_id,
        getChildPost,
        getByUser
      );
      setChildren(childrenData);
    } catch (error) {
      console.error("Error fetching children:", error);
      setChildren([]);
    } finally {
      setIsLoadingChildren(false);
    }
  };

  useEffect(() => {
    if (!user) return;
    checkFollowStatus(
      user.user_id,
      isOwnContent,
      post,
      setIsOwnContent,
      setFollowed,
      checkFollow
    );
  }, [user, post.creator_id, isOwnContent]);

  useEffect(() => {
    if (!user) return;
    getBoards(
      user.user_id,
      user.area_id,
      pinned,
      post,
      setUserBoards,
      setPinnedBoardId,
      getBoardByUser
    );
  }, [user]);

  useEffect(() => {
    fetchAncestors();
    fetchChildren();
  }, [post.content_id, post.area_id, user]);

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
          {isLoadingAncestors ? (
            <div className="space-y-2 pb-4 border-b border-dark-700">
              <div className="flex items-center justify-center py-4">
                <div className="text-gray-400 text-sm">
                  Loading ancestors...
                </div>
              </div>
            </div>
          ) : (
            ancestors &&
            ancestors.length > 0 && (
              <div className="space-y-2 pb-4 border-b border-dark-700">
                <h4 className="text-xs font-semibold text-gray-400 uppercase">
                  Replying to:
                </h4>
                <div className="space-y-2">
                  {ancestors.map((ancestor, index) => (
                    <div key={ancestor.content_id}>
                      <MiniPostDetail
                        post={ancestor}
                        onNavigate={onPostNavigate}
                      />
                      {index < ancestors.length - 1 && (
                        <div className="h-10 w-1 bg-red-400 my-2 rounded ml-4" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )
          )}

          <PostMediaGallery
            mediaItems={currentPost.contents}
            currentMediaIndex={currentMediaIndex}
            onPrevMedia={handlePrevMedia}
            onNextMedia={handleNextMedia}
            title={currentPost.title}
          />

          {user && (
            <PostDetailHeader
              creator={{
                profile_picture_url: post.profile_url,
                username: post.username,
                user_id: post.creator_id,
              }}
              followed={followed}
              isOwnContent={isOwnContent}
              onFollowClick={() => {
                if (!user) return;
                setFollowed(!followed);
                handleFollow(
                  !followed,
                  post.creator_id,
                  user.user_id,
                  user.username,
                  createFollow,
                  deleteFollow,
                  updateFollowUser,
                  sendNotificatonSystem
                );
              }}
            />
          )}

          <PostDetailMain
            title={currentPost.title}
            description={currentPost.description}
            likes={totalLikes}
            comments={totalComments}
            pins={totalPins}
            liked={liked}
            pinned={pinned}
            reported={reported}
            onLikeClick={() => handleBtnLike()}
            onPinClick={() => handleBtnPin()}
            onReportClick={() => setShowReportModal(true)}
            onReplyClick={() => {
              setShowCreatePost(true);
            }}
          />

          <div className="pt-4 border-t border-dark-700 space-y-4">
            <div>
              <h3 className="font-semibold text-gray-100 mb-4">Replies</h3>
              {isLoadingChildren ? (
                <div className="flex items-center justify-center py-4">
                  <div className="text-gray-400 text-sm">
                    Loading replies...
                  </div>
                </div>
              ) : children && children.length > 0 ? (
                <div className="space-y-2">
                  {children.map((child) => (
                    <MiniPostDetail
                      key={child.content_id}
                      post={child}
                      onNavigate={onPostNavigate}
                    />
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
        onClose={() => setShowCreatePost(false)}
        onRefreshChild={() => fetchChildren()}
        parentPostId={post.content_id}
        currentAreaId={post.area_id}
        onUpdateComment={() => handleBtnComment()}
      />
      <ReportModal
        isOpen={showReportModal}
        onClose={() => setShowReportModal(false)}
        content={post}
        onReportSuccess={() => {
          setReported(true);
          updateReport(true, post.content_id, updateReportUser);
          showToast("Content reported successfully");
        }}
      />

      <PinModal
        isOpen={showPinModal}
        onClose={() => setShowPinModal(false)}
        content={post}
        userBoards={userBoards}
        onPinSuccess={onPinSuccess}
      />
    </div>
  );
}
