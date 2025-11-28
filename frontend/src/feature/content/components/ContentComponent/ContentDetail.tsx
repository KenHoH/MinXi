"use client";

import type React from "react";

import { useEffect, useState } from "react";
import { HeaderContentComponent } from "./HeaderContentComponent";
import { InputContentCommentComponent } from "./InputContentCommentComponent";
import { FooterContentComponent } from "./FooterContentComponent";
import { ContentMediaGallery } from "./ContentMediaGallery";
import type { FullContentDto } from "@/service/api";

interface ContentDetailComponentProps {
  content: FullContentDto;
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
          mediaItems={content.contents}
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
            description={content.description}
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
