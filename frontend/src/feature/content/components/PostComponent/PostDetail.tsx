"use client";

import type React from "react";

import { useState } from "react";
import { X } from "lucide-react";
import { CommentParentComponent } from "../CommentParentComponent";
import { CreatePostModal } from "../CreatePostModal";
import { PostDetailHeader } from "./PostDetailHeader";
import { PostDetailMain } from "./PostDetailMain";
import { ReplyChain } from "./ReplyChain";
import { PostMediaGallery } from "./PostMediaGallery";
import type Content from "../../object/PublicContent";
import type { Connect } from "vite";

interface PostDetailComponentProps {
  post: Content;
  onClose: () => void;
  allPosts?: Record<number, Content>; // All posts for recursive lookup
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

  // // Mock posts with reply chains for testing
  // const mockPosts: Record<number, Connect> = {
  //   1: {
  //     content_id: 1,
  //     creator_id: 5,
  //     title: "Original thought about design",
  //     description: "Design is important for user experience",
  //     likes: 1200,
  //     comments: 45,
  //     post_type: "post",
  //   },
  //   2: {
  //     content_id: 2,
  //     creator_id: 12,
  //     title: "I completely agree with this",
  //     description:
  //       "Design really makes a difference in how users perceive your product",
  //     likes: 850,
  //     comments: 32,
  //     post_type: "post",
  //     parent_id: 1,
  //   },
  //   3: {
  //     content_id: 3,
  //     creator_id: 18,
  //     title: "Great discussion everyone",
  //     description:
  //       "This thread has some excellent insights about design principles",
  //     likes: 450,
  //     comments: 15,
  //     post_type: "post",
  //     parent_id: 2,
  //   },
  // };

  // // Merge provided allPosts with mock posts
  // const allPostsWithMock = { ...mockPosts, ...allPosts };

  // const mediaItems = [
  //   {
  //     type: "image" as const,
  //     src: `http://localhost:3000/uploads/thumbnail/1763296139023-929553449.jpg`,
  //   },
  //   {
  //     type: "video" as const,
  //     src: "http://localhost:3000/uploads/content/1763296139026-969061576.mp4",
  //   },
  //   {
  //     type: "image" as const,
  //     src: `http://localhost:3000/uploads/thumbnail/1763296139023-929553449.jpg`,
  //   },
  // ];

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
            mediaItems={post.metadata}
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
