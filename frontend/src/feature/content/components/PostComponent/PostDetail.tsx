"use client";

import type React from "react";

import { useState } from "react";
import { X } from "lucide-react";
import { CommentParentComponent } from "../CommentComponent/CommentParentComponent";
import { CreatePostModal } from "../../../create/components/CreatePost/CreatePostModal";
import { PostDetailHeader } from "./PostDetailHeader";
import { PostDetailMain } from "./PostDetailMain";
import { PostMediaGallery } from "./PostMediaGallery";
import type { FullContentDto } from "@/service/api";

interface PostDetailComponentProps {
  post: FullContentDto;
  onClose: () => void;
  allPosts?: Record<number, FullContentDto>; // All posts for recursive lookup
}

export function PostDetailComponent({
  post,
  onClose,
  allPosts = {},
}: PostDetailComponentProps) {
  const [liked, setLiked] = useState(false);
  const [followed, setFollowed] = useState(false);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);

  const handlePrevMedia = () => {
    // setCurrentMediaIndex((prev) =>
    //   // prev === 0 ? mediaItems.length - 1 : prev - 1
    // );
  };

  const handleNextMedia = () => {
    // setCurrentMediaIndex((prev) =>
    //   // prev === mediaItems.length - 1 ? 0 : prev + 1
    //   console.log("next media")
    // );
  };

  const handleClickOutside = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement)?.id === "modal-backdrop") {
      onClose();
    }
  };

  return (
    <div
      id="post-detail-backdrop"
      onClick={handleClickOutside}
      className="fixed inset-0 bg-black flex items-center justify-center z-50 p-4"
    >
      <div className="bg-dark-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-black rounded-full hover:bg-black text-white z-10"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="p-6 space-y-4">
          {/* {post.parent_id && (
            <ReplyChain parentId={post.parent_id} allPosts={allPostsWithMock} />
          )} */}

          <PostMediaGallery
            mediaItems={post.contents}
            currentMediaIndex={currentMediaIndex}
            onPrevMedia={handlePrevMedia}
            onNextMedia={handleNextMedia}
            title={post.title}
          />

          <PostDetailHeader
            creator_id={post.creator_id}
            followed={followed}
            onFollowClick={() => setFollowed(!followed)}
          />

          <PostDetailMain
            title={post.title}
            description={post.description}
            likes={post.likes}
            comments={post.comments}
            liked={liked}
            onLikeClick={() => setLiked(!liked)}
            onReplyClick={() => setShowCreatePost(true)}
          />

          <div className="pt-4 border-t border-dark-700 space-y-4">
            <div>
              <h3 className="font-semibold text-gray-100 mb-4">Replies</h3>
              <CommentParentComponent contentId={post.content_id} />
            </div>
          </div>
        </div>
      </div>

      <CreatePostModal
        isOpen={showCreatePost}
        onClose={() => setShowCreatePost(false)}
        parentPostId={post.content_id}
        currentUserId={post.creator_id}
      />
    </div>
  );
}
