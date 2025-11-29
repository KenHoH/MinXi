"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { useAuthContext } from "@/feature/auth/context/AuthContext";
import { useToast } from "@/shared/context/ToastContext";
import { HeaderContentComponent } from "./HeaderContentComponent";
import { InputContentCommentComponent } from "./InputContentCommentComponent";
import { FooterContentComponent } from "./FooterContentComponent";
import { ContentMediaGallery } from "./ContentMediaGallery";
import { ContentDetailSkeleton } from "./ContentDetailSkeleton";
import { ReportModal } from "./ReportModal";
import type { BoardDto, FullContentDto, UserDto } from "@/service/api";
import useUserService from "@/shared/hooks/useUserService";
import useHistoryService from "@/shared/hooks/useHistoryService";
import useContentService from "@/shared/hooks/useContentService";
import useCommentService from "@/shared/hooks/useCommentService";
import { Navigate } from "react-router";
import useBoardService from "@/shared/hooks/useBoardService";
import PinModal from "./PinModal";

interface ContentDetailComponentProps {
  content: FullContentDto;
  onClose: () => void;
  onLikeClick: (newLike: number) => void;
  onCommentClick: (newComment: number) => void;
}

export function ContentDetailComponent({
  content,
  onClose,
  onLikeClick,
  onCommentClick,
}: ContentDetailComponentProps) {
  // ============ AUTH & CONTEXT ============
  const { user } = useAuthContext();
  const { showToast } = useToast();

  // ============ UI STATE ============
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showPinModal, setShowPinModal] = useState(false);
  const [refreshComments, setRefreshComments] = useState(false);

  // ============ INTERACTION STATE ============
  const [liked, setLiked] = useState(false);
  const [pinned, setPinned] = useState(false);
  const [reported, setReported] = useState(false);
  const [followed, setFollowed] = useState(
    user?.user_id === content.creator_id
  );

  // ============ COMMENT STATE ============
  const [commentText, setCommentText] = useState("");
  const [replyingToCommentId, setReplyingToCommentId] = useState<number | null>(
    null
  );
  const [replyingToComment, setReplyingToComment] = useState<{
    id: number;
    text: string;
  } | null>(null);

  // ============ DATA STATE ============
  const [creatorData, setCreatorData] = useState<UserDto | null>(null);
  const [loggedUserData, setLoggedUserData] = useState<UserDto | null>(null);
  const [currentContent, setCurrentContent] = useState<FullContentDto>(content);
  const [totalLikes, setTotalLikes] = useState(content.likes);
  const [totalPins, setTotalPins] = useState(content.pins);
  const [totalReports, setTotalReports] = useState(content.reports);
  const [userBoards, setUserBoards] = useState<BoardDto[]>([]);
  const [pinnedBoardId, setPinnedBoardId] = useState<number | null>(null);

  // ============ HOOKS ============
  const { upsert, getByUserAndContent } = useHistoryService();
  const { updateLike, updatePin, updateComment, findOne } = useContentService();
  const { create } = useCommentService();
  const { findUserById } = useUserService();
  const { getBoardByUser, removeContent } = useBoardService();

  // ============ MEDIA GALLERY HANDLERS ============
  const handlePrevMedia = () => {
    setCurrentMediaIndex((prev) =>
      prev === 0 ? content.contents.length - 1 : prev - 1
    );
  };

  const handleNextMedia = () => {
    setCurrentMediaIndex((prev) =>
      prev === content.contents.length - 1 ? 0 : prev + 1
    );
  };

  // ============ COMMENT HANDLERS ============
  const handleComment = async (parentId: number | null) => {
    if (!user) return;
    try {
      // Update comment count on backend
      await updateComment(content.content_id, user.area_id, { delta: 1 });

      // Create new comment
      await create({
        content_id: content.content_id,
        parent_id: parentId ? parentId : undefined,
        text: commentText,
        creator_id: user.user_id,
        id: 0,
      });

      // Update UI and reset form
      onCommentClick(content.comments + 1);
      setRefreshComments((prev) => !prev);
      setCommentText("");
      setReplyingToCommentId(null);
      setReplyingToComment(null);
      showToast("Comment added successfully");
    } catch (error) {
      console.error("Failed to create comment:", error);
      showToast("Failed to add comment");
    }
  };

  // ============ MODAL HANDLERS ============
  const handleClickOutside = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement)?.id === "detail-backdrop") {
      onClose();
    }
  };

  // ============ INTERACTION HANDLERS ============
  const getBoards = async () => {
    if (!loggedUserData) return;

    const boards = await getBoardByUser(
      loggedUserData.user_id,
      loggedUserData.area_id
    );
    setUserBoards(boards || []);
    console.log("Fetched user boards:", boards);

    // Find which board contains this content if pinned
    if (pinned && boards) {
      for (const board of boards) {
        if (board.contents?.some((c) => c.content_id === content.content_id)) {
          setPinnedBoardId(board.board_id);
          break;
        }
      }
    }
  };

  const getHistory = async () => {
    if (!user) return;
    const res = await getByUserAndContent(user.user_id, content.content_id);
    if (res) {
      setLiked(res.some((history) => history.liked));
      setPinned(res.some((history) => history.pinned));
    }
  };

  const handleBtn = async (typeBtn: number) => {
    if (!user) return;
    switch (typeBtn) {
      case 1: {
        const newLiked = !liked;
        await updateLike(content.content_id, loggedUserData?.area_id || 0, {
          delta: newLiked ? 1 : -1,
        });
        setLiked(newLiked);
        setTotalLikes((prev) => prev + (newLiked ? 1 : -1));
        await upsert({
          content_id: content.content_id,
          user_id: user.user_id,
          liked: newLiked,
          pinned,
          reps: 0,
        });
        onLikeClick(totalLikes + (newLiked ? 1 : -1));
        break;
      }
      case 2: {
        const newPinned = !pinned;
        if (newPinned) {
          setShowPinModal(true);
        } else {
          await handleUnpin();
        }
        break;
      }
    }
  };

  const handleUnpin = async () => {
    if (!user || !loggedUserData || pinnedBoardId === null) return;

    try {
      await removeContent(pinnedBoardId, loggedUserData.area_id, {
        content_id: content.content_id,
      });

      await updatePin(content.content_id, loggedUserData.area_id, {
        delta: -1,
      });

      setTotalPins((prev) => prev - 1);
      setPinned(false);
      setPinnedBoardId(null);

      await upsert({
        content_id: content.content_id,
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

  // ============ EFFECTS ============
  // Fetch fresh content data whenever content_id changes
  useEffect(() => {
    const fetchFreshContent = async () => {
      try {
        const freshData = await findOne(content.content_id, content.area_id);
        if (freshData) {
          setCurrentContent(freshData);
          setTotalLikes(freshData.likes);
          setTotalPins(freshData.pins);
          setTotalReports(freshData.reports);

          // Update parent component with fresh data
          onLikeClick(freshData.likes);
          onCommentClick(freshData.comments);
        }
      } catch (error) {
        console.error("Failed to fetch updated content:", error);
      }
    };
    fetchFreshContent();
  }, [content.content_id, content.area_id]);

  // Fetch creator data and interaction history on mount
  useEffect(() => {
    const getCreator = async (userId: number) => {
      try {
        const response = await findUserById(userId);
        if (response) setCreatorData(response);
        return null;
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      }
    };
    getCreator(content.creator_id);
    getHistory();
  }, [content.creator_id, content.content_id]);

  // Get Logged User Data
  useEffect(() => {
    const getLoggedUserData = async () => {
      if (user) {
        const data = await findUserById(user.user_id);
        console.log("Fetched logged user data:", data);
        if (data) setLoggedUserData(data);
      }
    };
    getLoggedUserData();
  }, [user]);

  useEffect(() => {
    getBoards();
  }, [loggedUserData]);

  // Upset History
  useEffect(() => {
    if (!user) return;

    const timer = setTimeout(() => {
      const sendHistory = async () => {
        await upsert({
          content_id: content.content_id,
          user_id: user.user_id,
          liked,
          pinned,
          reps: 1,
        });
      };

      sendHistory();
    }, 5000);

    return () => clearTimeout(timer);
  }, [liked, pinned, reported, user, content.content_id]);

  if (!user) {
    showToast("You must be logged in to view content details.");
    return <Navigate to="/login" />;
  }

  return (
    <div
      id="detail-backdrop"
      onClick={handleClickOutside}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
    >
      <div className="flex gap-6 w-full max-w-5xl h-[85vh] bg-black/80 rounded-lg overflow-hidden">
        <ContentMediaGallery
          mediaItems={currentContent.contents}
          currentMediaIndex={currentMediaIndex}
          onPrevMedia={handlePrevMedia}
          onNextMedia={handleNextMedia}
          onClose={onClose}
          title={currentContent.title}
        />

        <div className="w-80 flex flex-col  border-l border-dark-700">
          {creatorData ? (
            <>
              <HeaderContentComponent
                refresh={refreshComments}
                creator={creatorData}
                title={currentContent.title}
                description={currentContent.description}
                views={currentContent.views}
                content_id={currentContent.content_id}
                followed={followed}
                onFollowClick={() => setFollowed(!followed)}
                replyingTo={replyingToCommentId}
                onReplySelect={(id, text) => {
                  setReplyingToCommentId(id);
                  setReplyingToComment({ id, text });
                }}
              />

              {/* Comment Input */}
              <InputContentCommentComponent
                commentText={commentText}
                replyingTo={replyingToCommentId}
                replyingToComment={replyingToComment}
                onCommentChange={setCommentText}
                onCommentSubmit={handleComment}
                onCancelReply={() => {
                  setReplyingToCommentId(null);
                  setReplyingToComment(null);
                }}
                profile={
                  loggedUserData?.profile_picture ||
                  "http://localhost:3000/uploads/profile/1763906830326-69740177.png"
                }
              />
            </>
          ) : (
            <ContentDetailSkeleton />
          )}

          {/* Footer - Interaction Stats & Actions */}
          <FooterContentComponent
            likes={totalLikes}
            comments={currentContent.comments}
            liked={liked}
            pinned={pinned}
            reported={reported}
            pins={totalPins}
            reports={totalReports}
            onLikeClick={() => handleBtn(1)}
            onPin={() => (pinned ? handleBtn(2) : setShowPinModal(true))}
            onReport={() => setShowReportModal(true)}
          />
        </div>
      </div>

      {/* Report Modal */}
      <ReportModal
        isOpen={showReportModal}
        onClose={() => setShowReportModal(false)}
        content={content}
        loggedUserData={loggedUserData}
        onReportSuccess={() => {
          setReported(true);
          setTotalReports((prev) => prev + 1);
        }}
      />

      <PinModal
        isOpen={showPinModal}
        onClose={() => setShowPinModal(false)}
        content={content}
        loggedUserData={loggedUserData}
        userBoards={userBoards}
        onPinSuccess={async (boardId) => {
          if (!user) return;
          try {
            await updatePin(content.content_id, loggedUserData?.area_id || 0, {
              delta: 1,
            });

            // Upsert history
            await upsert({
              content_id: content.content_id,
              user_id: user.user_id,
              liked,
              pinned: true,
              reps: 0,
            });

            setPinnedBoardId(boardId);
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
