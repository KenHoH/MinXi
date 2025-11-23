"use client";

import type React from "react";

import { useState } from "react";
import { HeaderContentComponent } from "./HeaderContentComponent";
import { InputContentCommentComponent } from "./InputContentCommentComponent";
import { FooterContentComponent } from "./FooterContentComponent";
import { ContentMediaGallery } from "./ContentMediaGallery";

interface Content {
  content_id: number;
  creator_id: number;
  title: string;
  post_type: "image" | "video";
  likes: number;
  comments: number;
  views: number;
}

interface MediaItem {
  type: "image" | "video";
  src: string;
}

interface ContentDetailComponentProps {
  content: Content;
  onClose: () => void;
}

export function ContentDetailComponent({
  content,
  onClose,
}: ContentDetailComponentProps) {
  const [liked, setLiked] = useState(false);
  const [followed, setFollowed] = useState(false);
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [commentText, setCommentText] = useState("");

  const mediaItems: MediaItem[] =
    content.post_type === "video"
      ? [
          {
            type: "video",
            src: "http://localhost:3000/uploads/content/1763296139026-969061576.mp4",
          },
        ]
      : [
          {
            type: "image",
            src: `http://localhost:3000/uploads/thumbnail/1763296139023-929553449.jpg`,
          },
          {
            type: "image",
            src: `http://localhost:3000/uploads/thumbnail/1763296139023-929553449.jpg`,
          },
          {
            type: "image",
            src: `http://localhost:3000/uploads/thumbnail/1763296139023-929553449.jpg`,
          },
        ];

  const handlePrevMedia = () => {
    setCurrentMediaIndex((prev) =>
      prev === 0 ? mediaItems.length - 1 : prev - 1
    );
  };

  const handleNextMedia = () => {
    setCurrentMediaIndex((prev) =>
      prev === mediaItems.length - 1 ? 0 : prev + 1
    );
  };

  const handleClickOutside = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement)?.id === "detail-backdrop") {
      onClose();
    }
  };

  return (
    <div
      id="detail-backdrop"
      onClick={handleClickOutside}
      className="fixed inset-0 bg-black/95 flex items-center justify-center z-50 p-4"
    >
      <div className="flex gap-6 w-full max-w-5xl h-[85vh] bg-dark-800 rounded-lg overflow-hidden">
        <ContentMediaGallery
          mediaItems={mediaItems}
          currentMediaIndex={currentMediaIndex}
          onPrevMedia={handlePrevMedia}
          onNextMedia={handleNextMedia}
          onClose={onClose}
          title={content.title}
        />

        <div className="w-80 flex flex-col bg-dark-800 border-l border-dark-700">
          <HeaderContentComponent
            creator_id={content.creator_id}
            title={content.title}
            views={content.views}
            content_id={content.content_id}
            followed={followed}
            onFollowClick={() => setFollowed(!followed)}
          />

          <InputContentCommentComponent
            commentText={commentText}
            onCommentChange={setCommentText}
          />

          <FooterContentComponent
            likes={content.likes}
            comments={content.comments}
            liked={liked}
            onLikeClick={() => setLiked(!liked)}
          />
        </div>
      </div>
    </div>
  );
}
