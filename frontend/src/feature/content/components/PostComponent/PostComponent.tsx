"use client";

import { useState } from "react";

import { PostFooterInfo } from "./PostFooterInfo";
import { PostHeaderInfo } from "./PostHeaderInfo";
import { PostDetailComponent } from "./PostDetail";
import type Content from "../../object/PublicContent";

interface PostComponentProps {
  post: Content;
}

export function PostComponent({ post }: PostComponentProps) {
  const [showDetail, setShowDetail] = useState(false);
  const heights = ["min-h-[180px]", "min-h-[220px]", "min-h-[160px]"];
  const randomHeight = heights[post.content_id % heights.length];

  return (
    <>
      <div
        onClick={() => setShowDetail(true)}
        className={`bg-dark-800 border border-dark-700 rounded-lg p-4 cursor-pointer hover:border-burgundy-600 hover:shadow-lg hover:shadow-burgundy-500/20 transition-all w-full ${randomHeight} flex flex-col justify-between`}
      >
        <PostHeaderInfo title={post.title} description={post.description} />
        <PostFooterInfo likes={post.likes} comments={post.comments} />
      </div>

      {showDetail && (
        <PostDetailComponent post={post} onClose={() => setShowDetail(false)} />
      )}
    </>
  );
}
