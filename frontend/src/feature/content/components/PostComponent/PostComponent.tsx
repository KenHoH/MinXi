import { useEffect, useState } from "react";

import { PostFooterInfo } from "./PostFooterInfo";
import { PostHeaderInfo } from "./PostHeaderInfo";
import { PostDetailComponent } from "./PostDetail";
import type { FullContentDto, UserDto } from "@/service/api";
import useContentService from "@/shared/hooks/useContentService";
import useUserService from "@/shared/hooks/useUserService";
import type { FullContentWithHistoryProps } from "../models/FullContentWithHistory";
import useHistoryService from "@/shared/hooks/useHistoryService";

interface PostComponentProps {
  post: FullContentWithHistoryProps;
  liked: boolean;
  pinned: boolean;
}

export function PostComponent({ post, liked, pinned }: PostComponentProps) {
  const [showDetail, setShowDetail] = useState(false);
  const heights = ["min-h-[180px]", "min-h-[220px]", "min-h-[160px]"];
  const randomHeight = heights[post.content_id % heights.length];
  const [currentPost, setCurrentPost] =
    useState<FullContentWithHistoryProps>(post);
  const [ancestor, setAncestor] = useState<FullContentWithHistoryProps[]>([]);
  const [children, setChildren] = useState<FullContentDto[] | null>(null);
  const [likes, setLikes] = useState(post.likes);
  const [comments, setComments] = useState(post.comments);
  const [pins, setPins] = useState(post.pins);
  const [likedState, setLikedState] = useState(liked);
  const [pinnedState, setPinnedState] = useState(pinned);
  const { getAncestorPost, getChildPost } = useContentService();

  const [loggedUserData, setLoggedUserData] = useState<UserDto | null>(null);
  const { getByUser } = useHistoryService();

  const { findUserById } = useUserService();
  useEffect(() => {
    const fetchCreatorData = async () => {
      const userData: UserDto | null = await findUserById(post.creator_id);
      if (userData) setLoggedUserData(userData);
    };
    fetchCreatorData();
  }, [post.creator_id]);

  // Get Posts
  const getAncestors = async (
    postId: number,
    areaId: number,
    userId: number
  ) => {
    const [ancestorsList, histories] = await Promise.all([
      getAncestorPost(postId, areaId),
      getByUser(userId),
    ]);

    if (!ancestorsList) return [];
    if (!histories)
      return ancestorsList.map((item) => ({
        ...item,
        liked: false,
        pinned: false,
      }));

    const mergedAncestors = ancestorsList.map((item) => {
      const userHistory = histories.find(
        (h) => h.content_id === item.content_id
      );
      return {
        ...item,
        liked: userHistory?.liked || false,
        pinned: userHistory?.pinned || false,
      };
    });

    return mergedAncestors;
  };

  const getChildren = async (postId: number) => {
    console.log("Fetching children for post:", postId);
    const res = await getChildPost(postId);
    console.log("Children:", res, "for post:", postId);
    return res;
  };

  // Navigation handler for MiniPostDetail
  const handlePostNavigate = async (newPost: FullContentDto) => {
    console.log("Navigating to post:", newPost.content_id);
    console.log("New Post Data:", newPost);

    // Fetch user history for the new post
    const histories = await getByUser(loggedUserData?.user_id || 0);
    const userHistory = histories?.find(
      (h) => h.content_id === newPost.content_id
    );

    const newPostWithHistory: FullContentWithHistoryProps = {
      ...newPost,
      liked: userHistory?.liked || false,
      pinned: userHistory?.pinned || false,
    };

    // Update current post
    setCurrentPost(newPostWithHistory);
    setLikes(newPost.likes);
    setComments(newPost.comments);
    setPins(newPost.pins);
    setLikedState(userHistory?.liked || false);
    setPinnedState(userHistory?.pinned || false);

    // Fetch new ancestors and children
    const [newAncestors, newChildren] = await Promise.all([
      getAncestors(
        newPost.content_id,
        newPost.area_id,
        loggedUserData?.user_id || 0
      ),
      getChildren(newPost.content_id),
    ]);

    if (newAncestors) setAncestor(newAncestors);
    if (newChildren) setChildren(newChildren);
  };

  useEffect(() => {
    const fetchInitialData = async () => {
      if (!loggedUserData?.user_id) return;

      const [ancestorsList, childrenList] = await Promise.all([
        getAncestors(post.content_id, post.area_id, loggedUserData.user_id),
        getChildren(post.content_id),
      ]);

      if (ancestorsList) setAncestor(ancestorsList);
      if (childrenList) setChildren(childrenList);
    };

    fetchInitialData();
  }, [loggedUserData?.user_id]);

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
          liked={likedState}
          pinned={pinnedState}
          creator={loggedUserData?.username || "anonymous"}
          creatorProfile={
            loggedUserData?.profile_picture ||
            "http://localhost:3000/uploads/profile/1763906830326-69740177.png"
          }
        />
      </div>

      {showDetail && (
        <PostDetailComponent
          key={currentPost.content_id}
          post={currentPost}
          ancestors={ancestor}
          children={children}
          onRefreshChild={async () => {
            const newChildren = await getChildren(currentPost.content_id);
            if (newChildren) setChildren(newChildren);
          }}
          onClose={() => setShowDetail(false)}
          liked={likedState}
          pinned={pinnedState}
          likes={likes}
          pins={pins}
          comments={comments}
          onLikeClick={setLikes}
          onCommentClick={setComments}
          onPinClick={setPins}
          onLiked={setLikedState}
          onPinned={setPinnedState}
          onPostNavigate={handlePostNavigate}
        />
      )}
    </>
  );
}
