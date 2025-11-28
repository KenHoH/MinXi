"use client";

import type React from "react";

import { useCallback, useEffect, useState } from "react";
import { useAuthContext } from "@/feature/auth/context/AuthContext";
import { useToast } from "@/shared/context/ToastContext";
import { HeaderContentComponent } from "./HeaderContentComponent";
import { InputContentCommentComponent } from "./InputContentCommentComponent";
import { FooterContentComponent } from "./FooterContentComponent";
import { ContentMediaGallery } from "./ContentMediaGallery";
import { ContentDetailSkeleton } from "./ContentDetailSkeleton";
import { ReportModal } from "./ReportModal";
import type { FullContentDto, UserDto } from "@/service/api";
import useUserService from "@/shared/hooks/useUserService";
import useHistoryService from "@/shared/hooks/useHistoryService";
import useContentService from "@/shared/hooks/useContentService";
import useReportService from "@/shared/hooks/useReportService";
import useCommentService from "@/shared/hooks/useCommentService";

interface ContentDetailComponentProps {
  content: FullContentDto;
  onClose: () => void;
}

export function ContentDetailComponent({
  content,
  onClose,
}: ContentDetailComponentProps) {
  const { user } = useAuthContext();
  const [liked, setLiked] = useState(false);
  const [pinned, setPinned] = useState(false);
  const [reported, setReported] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportLoading, setReportLoading] = useState(false);
  const [followed, setFollowed] = useState(
    user?.user_id === content.creator_id
  );
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [commentText, setCommentText] = useState("");
  const [replyingToCommentId, setReplyingToCommentId] = useState<number | null>(
    null
  );
  const [replyingToComment, setReplyingToComment] = useState<{
    id: number;
    text: string;
  } | null>(null);
  const [userData, setUserdata] = useState<UserDto | null>(null);
  const [totalLikes, setTotalLikes] = useState(content.likes);
  const [totalPins, setTotalPins] = useState(content.pins);
  const [totalReports, setTotalReports] = useState(content.reports);
  const [refreshComments, setRefreshComments] = useState(false);

  const { upsert, getByUserAndContent } = useHistoryService();
  const { updateLike, updatePin, updateReport, updateComment } =
    useContentService();
  const { create } = useCommentService();
  const { createReport } = useReportService();
  const { findUserById } = useUserService();
  const { showToast } = useToast();

  const handlePrevMedia = () => {
    setCurrentMediaIndex((prev) =>
      prev === 0 ? content.contents.length - 1 : prev - 1
    );
  };

  const handleComment = async (parentId: number | null) => {
    if (!user) return;
    try {
      await updateComment(content.content_id, user.area_id, {
        delta: 1,
      });
      await create({
        content_id: content.content_id,
        parent_id: parentId ? parentId : undefined,
        text: commentText,
        creator_id: user.user_id,
        id: 0,
      });
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

  const handleNextMedia = () => {
    setCurrentMediaIndex((prev) =>
      prev === content.contents.length - 1 ? 0 : prev + 1
    );
  };

  const handleClickOutside = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement)?.id === "detail-backdrop") {
      onClose();
    }
  };

  const getHistory = async () => {
    if (!user) return;
    const res = await getByUserAndContent(user.user_id, content.content_id);
    if (res) {
      console.log("History fetched:", res);
      setLiked(res.some((history) => history.liked));
      setPinned(res.some((history) => history.pinned));
    }
  };

  const handleBtn = async (typeBtn: number) => {
    if (!user) return;
    switch (typeBtn) {
      case 1: {
        const newLiked = !liked;
        await updateLike(content.content_id, userData?.area_id || 0, {
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
        break;
      }
      case 2: {
        const newPinned = !pinned;
        await updatePin(content.content_id, userData?.area_id || 0, {
          delta: newPinned ? 1 : -1,
        });
        setTotalPins((prev) => prev + (newPinned ? 1 : -1));
        setPinned(newPinned);
        await upsert({
          content_id: content.content_id,
          user_id: user.user_id,
          liked,
          pinned: newPinned,
          reps: 0,
        });
        break;
      }
    }
  };

  const fetchUserData = useCallback(
    async (userId: number) => {
      try {
        const response = await findUserById(userId);
        if (response) setUserdata(response);
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      }
    },
    [findUserById]
  );

  const handleReportSubmit = async (type: string, description: string) => {
    setReportLoading(true);
    try {
      await createReport({
        creator_id: content.creator_id,
        userId: user?.user_id || 0,
        desc: description,
        type: type as any,
      });
      setReported(true);
      await updateReport(content.content_id, userData?.area_id || 0, {
        delta: 1,
      });
      setTotalReports((prev) => prev + 1);
      showToast("Report submitted successfully");
    } catch (error) {
      console.error("Failed to submit report:", error);
      showToast("Failed to submit report");
      throw error;
    } finally {
      setReportLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData(content.creator_id);
    getHistory();
  }, [content.creator_id, content.content_id]);

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

      alert("History sent");
      sendHistory();
    }, 5000);

    return () => clearTimeout(timer);
  }, [liked, pinned, reported]);

  return (
    <div
      id="detail-backdrop"
      onClick={handleClickOutside}
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
    >
      <div className="flex gap-6 w-full max-w-5xl h-[85vh] bg-dark-800 rounded-lg overflow-hidden">
        <ContentMediaGallery
          mediaItems={content.contents}
          currentMediaIndex={currentMediaIndex}
          onPrevMedia={handlePrevMedia}
          onNextMedia={handleNextMedia}
          onClose={onClose}
          title={content.title}
        />

        <div className="w-80 flex flex-col bg-dark-800 border-l border-dark-700">
          {userData ? (
            <>
              <HeaderContentComponent
                refresh={refreshComments}
                creator={userData}
                title={content.title}
                description={content.description}
                views={content.views}
                content_id={content.content_id}
                followed={followed}
                onFollowClick={() => setFollowed(!followed)}
                replyingTo={replyingToCommentId}
                onReplySelect={(id, text) => {
                  setReplyingToCommentId(id);
                  setReplyingToComment({ id, text });
                }}
              />

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
                profile={userData.profile_picture}
              />
            </>
          ) : (
            <ContentDetailSkeleton />
          )}

          <FooterContentComponent
            likes={totalLikes}
            comments={content.comments}
            liked={liked}
            pinned={pinned}
            reported={reported}
            pins={totalPins}
            reports={totalReports}
            onLikeClick={() => handleBtn(1)}
            onPin={() => handleBtn(2)}
            onReport={() => setShowReportModal(true)}
          />
        </div>
      </div>

      <ReportModal
        isOpen={showReportModal}
        onClose={() => setShowReportModal(false)}
        onSubmit={handleReportSubmit}
        isLoading={reportLoading}
      />
    </div>
  );
}
