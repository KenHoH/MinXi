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
import useConnectionService from "@/shared/hooks/useConnectionService";
import useNotification from "@/shared/logic/useNotificatoin";

interface ContentDetailComponentProps {
  content: FullContentDto;
  onClose: () => void;
  liked: boolean;
  pinned: boolean;
  likes: number;
  pins: number;
  comments: number;
  reports: number;
  onLikeClick: (newLike: number) => void;
  onPinClick: (newPin: number) => void;
  onCommentClick: (newComment: number) => void;
  onlikedChange: (liked: boolean) => void;
  onpinnedChange: (pinned: boolean) => void;
}

export function ContentDetailComponent(props: ContentDetailComponentProps) {
  const {
    content,
    onClose,
    onLikeClick,
    onPinClick,
    onCommentClick,
    onlikedChange,
    onpinnedChange,
    liked: propsLiked,
    pinned: propsPinned,
    likes: propsLikes,
    pins: propsPins,
    comments: propsComments,
    reports: propsReports,
  } = props;
  const { user } = useAuthContext();
  const { showToast } = useToast();
  const { updateFollowUser, updateLikeUser, updateReportUser } =
    useUserService();

  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showPinModal, setShowPinModal] = useState(false);
  const [refreshComments, setRefreshComments] = useState(false);

  const [liked, setLiked] = useState(props.liked);
  const [pinned, setPinned] = useState(props.pinned);
  const [reported, setReported] = useState(false);
  const [followed, setFollowed] = useState(false);
  const [isOwnContent, setIsOwnContent] = useState(false);

  const [commentText, setCommentText] = useState("");
  const [replyingToCommentId, setReplyingToCommentId] = useState<number | null>(
    null
  );
  const [replyingToComment, setReplyingToComment] = useState<{
    id: number;
    text: string;
  } | null>(null);

  const [creatorData, setCreatorData] = useState<UserDto | null>(null);
  const [loggedUserData, setLoggedUserData] = useState<UserDto | null>(null);
  const [totalLikes, setTotalLikes] = useState(props.likes);
  const [totalComments, setTotalComments] = useState(props.comments);
  const [totalPins, setTotalPins] = useState(props.pins);
  const [totalReports, setTotalReports] = useState(props.reports);
  const [userBoards, setUserBoards] = useState<BoardDto[]>([]);
  const [pinnedBoardId, setPinnedBoardId] = useState<number | null>(null);

  useEffect(() => {
    setLiked(propsLiked);
    setPinned(propsPinned);
    setTotalLikes(propsLikes);
    setTotalPins(propsPins);
    setTotalComments(propsComments);
    setTotalReports(propsReports);
  }, [
    propsLiked,
    propsPinned,
    propsLikes,
    propsPins,
    propsComments,
    propsReports,
  ]);

  const { upsert } = useHistoryService();
  const { updateLike, updatePin, updateComment, updateView, updateReport } =
    useContentService();
  const { create } = useCommentService();
  const { findUserById } = useUserService();
  const { getBoardByUser, removeContent } = useBoardService();
  const { createFollow, deleteFollow, checkFollow } = useConnectionService();
  const { sendNotificatonSystem } = useNotification();

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

  const handleComment = async (parentId: number | null) => {
    if (!user) return;
    try {
      if (commentText.trim() === "") {
        showToast("Comment cannot be empty");
        return;
      }

      await updateComment(content.content_id, user.area_id, { delta: 1 });

      await create({
        content_id: content.content_id,
        parent_id: parentId ? parentId : 0,
        text: commentText,
        creator_id: user.user_id,
        id: 0,
      });

      setTotalComments((prev) => prev + 1);

      if (onCommentClick) {
        onCommentClick(totalComments + 1);
        if (user.user_id !== content.creator_id) {
          sendNotificatonSystem(
            content.creator_id,
            user.user_id,
            `Your post received a new comment! from ${
              user.username || "someone"
            }`,
            "New Comment",
            "COMMENT"
          );
        }
      }

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

  const handleClickOutside = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement)?.id === "detail-backdrop") {
      onClose();
    }
  };

  const getBoards = async () => {
    if (!loggedUserData) return;

    const boards = await getBoardByUser(
      loggedUserData.user_id,
      loggedUserData.area_id
    );
    setUserBoards(boards || []);
    console.log("Fetched user boards:", boards);

    if (pinned && boards) {
      for (const board of boards) {
        if (board.contents?.some((c) => c.content_id === content.content_id)) {
          setPinnedBoardId(board.board_id);
          break;
        }
      }
    }
  };

  const handleFollow = async (delta: boolean) => {
    if (!user) return;
    if (!loggedUserData) return;

    if (delta == false) {
      await createFollow(content.creator_id, user.user_id);
      await updateFollowUser(content.creator_id, { delta: 1 });
      sendNotificatonSystem(
        content.creator_id,
        user.user_id,
        `${loggedUserData.username} started following you!`,
        "New Follower",
        "FOLLOW"
      );
    } else {
      await deleteFollow(content.creator_id, user.user_id);
      await updateFollowUser(content.creator_id, { delta: -1 });
    }
  };

  const handleBtn = async (typeBtn: number) => {
    if (!user) return;
    switch (typeBtn) {
      case 1: {
        const newLiked = !liked;
        setLiked(newLiked);
        setTotalLikes((prev) => prev + (newLiked ? 1 : -1));
        onLikeClick(totalLikes + (newLiked ? 1 : -1));
        onlikedChange(newLiked);

        await Promise.all([
          updateLike(content.content_id, loggedUserData?.area_id || 0, {
            delta: newLiked ? 1 : -1,
          }),
          updateLikeUser(content.creator_id, { delta: newLiked ? 1 : -1 }),
          upsert({
            content_id: content.content_id,
            user_id: user.user_id,
            liked: newLiked,
            pinned,
            reps: 0,
          }),
        ]);
        if (newLiked) {
          if (user.user_id !== content.creator_id) {
            sendNotificatonSystem(
              content.creator_id,
              user.user_id,
              `Your post was liked! by ${
                loggedUserData?.username || "someone"
              }`,
              "Liked post",
              "LIKE"
            );
          }
        }
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
      case 3: {
        const newReport = !reported;
        await Promise.all([
          updateReport(content.content_id, loggedUserData?.area_id || 0, {
            delta: newReport ? 1 : -1,
          }),
          updateReportUser(content.creator_id, {
            delta: newReport ? 1 : -1,
          }),
          upsert({
            content_id: content.content_id,
            user_id: user.user_id,
            liked,
            pinned,
            reps: 0,
          }),
        ]);
        setReported(newReport);
        setTotalReports((prev) => prev + (newReport ? 1 : -1));
        break;
      }
    }
  };

  const onPinSuccess = async (boardId: number) => {
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

      const newPinCount = totalPins + 1;
      setPinnedBoardId(boardId);
      setPinned(true);
      setTotalPins(newPinCount);
      setShowPinModal(false);

      onPinClick(newPinCount);
      onpinnedChange(true);
    } catch (error) {
      console.error("Failed to complete pin:", error);
      showToast("Failed to complete pin");
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

      const newPinCount = totalPins - 1;
      setTotalPins(newPinCount);
      setPinned(false);
      setPinnedBoardId(null);

      onPinClick(newPinCount);
      onpinnedChange(false);

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

    if (user?.user_id === content.creator_id) {
      setIsOwnContent(true);
    } else {
      setIsOwnContent(false);
    }
  }, [content.creator_id, content.content_id, user?.user_id]);

  useEffect(() => {
    console.error("Testis Content Detail");
    const getLoggedUserData = async () => {
      if (user) {
        const data = await findUserById(user.user_id);
        console.log("Fetched logged user data:", data);
        if (data) setLoggedUserData(data);
      }
    };
    getLoggedUserData();
  }, [user]);

  // Check follow status if not own content
  useEffect(() => {
    const checkFollowStatus = async () => {
      if (!user || isOwnContent) {
        setFollowed(false);
        return;
      }

      try {
        const isFollowing = await checkFollow(content.creator_id, user.user_id);
        setFollowed(isFollowing || false);
      } catch (error) {
        console.error("Failed to check follow status:", error);
        setFollowed(false);
      }
    };

    checkFollowStatus();
  }, [user, content.creator_id, isOwnContent]);

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

        await updateView(content.content_id, content.area_id, { delta: 1 });
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
          mediaItems={content.contents}
          currentMediaIndex={currentMediaIndex}
          onPrevMedia={handlePrevMedia}
          onNextMedia={handleNextMedia}
          onClose={onClose}
          title={content.title}
        />

        <div className="w-80 flex flex-col  border-l border-dark-700">
          {creatorData ? (
            <>
              <HeaderContentComponent
                refresh={refreshComments}
                creator={{
                  username: content.username,
                  profile_picture_url: content.profile_url,
                  user_id: content.creator_id,
                }}
                title={content.title}
                description={content.description}
                views={content.views}
                content_id={content.content_id}
                followed={followed}
                isOwnContent={isOwnContent}
                onFollowClick={() => {
                  setFollowed(!followed);
                  handleFollow(followed);
                }}
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

          <FooterContentComponent
            likes={totalLikes}
            comments={totalComments}
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
        onPinSuccess={onPinSuccess}
      />
    </div>
  );
}
