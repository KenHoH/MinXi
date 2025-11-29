import { useEffect, useState } from "react";

import { PostFooterInfo } from "./PostFooterInfo";
import { PostHeaderInfo } from "./PostHeaderInfo";
import { PostDetailComponent } from "./PostDetail";
import type { FullContentDto, UserDto } from "@/service/api";
import useContentService from "@/shared/hooks/useContentService";
import useUserService from "@/shared/hooks/useUserService";

interface PostComponentProps {
  post: FullContentDto;
}

export function PostComponent({ post }: PostComponentProps) {
  const [showDetail, setShowDetail] = useState(false);
  const heights = ["min-h-[180px]", "min-h-[220px]", "min-h-[160px]"];
  const randomHeight = heights[post.content_id % heights.length];
  const [ancestor, setAncestor] = useState<FullContentDto[] | null>(null);
  const [children, setChildren] = useState<FullContentDto[] | null>(null);
  const [likes, setLikes] = useState(post.likes);
  const [comments, setComments] = useState(post.comments);
  const [pins, setPins] = useState(post.pins);

  const { getAncestorPost, getChildPost } = useContentService();

  const [loggedUserData, setLoggedUserData] = useState<UserDto | null>(null);

  const { findUserById } = useUserService();
  useEffect(() => {
    const fetchCreatorData = async () => {
      const userData: UserDto | null = await findUserById(post.creator_id);
      if (userData) setLoggedUserData(userData);
    };
    fetchCreatorData();
  }, [post.creator_id]);

  // Get Posts
  const getAncestors = async () => {
    const res = await getAncestorPost(post.content_id, post.area_id);
    if (res) setAncestor(res);
  };

  const getChildren = async () => {
    console.log("Fetching children for post:", post.content_id);
    const res = await getChildPost(post.content_id);
    console.log("Children:", res, "for post:", post.content_id);
    if (res) setChildren(res);
  };

  useEffect(() => {
    getAncestors();
    getChildren();
  }, []);

  return (
    <>
      <div
        onClick={() => setShowDetail(true)}
        className={`bg-dark-800 border border-dark-700 rounded-lg p-4 cursor-pointer hover:border-burgundy-600 hover:shadow-lg hover:shadow-burgundy-500/20 transition-all w-full ${randomHeight} flex flex-col justify-between`}
      >
        <PostHeaderInfo title={post.title} description={post.description} />
        <PostFooterInfo
          likes={likes}
          comments={comments}
          pins={pins}
          creator={loggedUserData?.username || "anonymous"}
          creatorProfile={
            loggedUserData?.profile_picture ||
            "http://localhost:3000/uploads/profile/1763906830326-69740177.png"
          }
        />
      </div>

      {showDetail && (
        <PostDetailComponent
          post={post}
          ancestors={ancestor}
          children={children}
          onRefreshChild={() => getChildren()}
          onClose={() => setShowDetail(false)}
          onLikeClick={setLikes}
          onCommentClick={setComments}
          onPinClick={setPins}
        />
      )}
    </>
  );
}
