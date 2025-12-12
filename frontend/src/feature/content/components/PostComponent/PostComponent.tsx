import { useEffect, useState, useRef } from "react";
import { PostFooterInfo } from "./PostFooterInfo";
import { PostHeaderInfo } from "./PostHeaderInfo";
import { PostDetailComponent } from "./PostDetail";
import type { CreateHistoryDto, FullContentDto, UserDto } from "@/service/api";
import type { FullContentWithHistoryProps } from "../models/FullContentWithHistory";
import useHistoryService from "@/shared/hooks/useHistoryService";
import { useAuthContext } from "@/feature/auth/context/AuthContext";

interface PostComponentProps {
  post: FullContentWithHistoryProps;
  liked?: boolean;
  pinned?: boolean;
}

export function PostComponent({ post, liked, pinned }: PostComponentProps) {
  const [showDetail, setShowDetail] = useState(false);
  const heights = ["min-h-[180px]", "min-h-[220px]", "min-h-[160px]"];
  const randomHeight = heights[post.content_id % heights.length];
  const [currentPost, setCurrentPost] =
    useState<FullContentWithHistoryProps>(post);
  const [likes, setLikes] = useState(post.likes);
  const [comments, setComments] = useState(post.comments);
  const [pins, setPins] = useState(post.pins);
  const [likedState, setLikedState] = useState(liked);
  const [pinnedState, setPinnedState] = useState(pinned);
  const [history, setHistory] = useState<CreateHistoryDto>();
  const originalPostRef = useRef<FullContentWithHistoryProps>(post);

  const { getByUserAndContent } = useHistoryService();
  const { getByUser } = useHistoryService();
  const { user } = useAuthContext();

  useEffect(() => {
    const fetchHistoryUser = async () => {
      const histories = await getByUserAndContent(
        post.creator_id,
        post.content_id
      );
      if (histories) setHistory(histories);
    };
    fetchHistoryUser();
  }, []);

  const handlePostNavigate = async (newPost: FullContentDto) => {
    console.log("Navigating to post:", newPost.content_id);
    console.log("New Post Data:", newPost);

    const histories = await getByUser(user?.user_id || 0);
    const userHistory = histories?.find(
      (h) => h.content_id === newPost.content_id
    );

    const newPostWithHistory: FullContentWithHistoryProps = {
      ...newPost,
      liked: userHistory?.liked || false,
      pinned: userHistory?.pinned || false,
    };

    setCurrentPost(newPostWithHistory);
    setLikes(newPost.likes);
    setComments(newPost.comments);
    setPins(newPost.pins);
    setLikedState(userHistory?.liked || false);
    setPinnedState(userHistory?.pinned || false);
  };

  const handleBack = async (oldPost: FullContentDto) => {
    const histories = await getByUser(user?.user_id || 0);
    const userHistory = histories?.find(
      (h) => h.content_id === oldPost.content_id
    );

    const newPostWithHistory: FullContentWithHistoryProps = {
      ...oldPost,
      liked: userHistory?.liked || false,
      pinned: userHistory?.pinned || false,
    };

    setCurrentPost(newPostWithHistory);
    setLikes(oldPost.likes);
    setComments(oldPost.comments);
    setPins(oldPost.pins);
    setLikedState(userHistory?.liked || false);
    setPinnedState(userHistory?.pinned || false);
  };

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
          liked={likedState ?? history?.liked ?? false}
          pinned={pinnedState ?? history?.pinned ?? false}
          creator={post.username || "anonymous"}
          creatorProfile={
            post.profile_url ||
            "http://localhost:3000/uploads/profile/1763906830326-69740177.png"
          }
        />
      </div>

      {showDetail && (
        <PostDetailComponent
          key={currentPost.content_id}
          post={currentPost}
          onClose={() => {
            setShowDetail(false);
            if (currentPost.content_id !== originalPostRef.current.content_id) {
              handleBack(originalPostRef.current);
            }
          }}
          liked={likedState ?? history?.liked ?? false}
          pinned={pinnedState ?? history?.pinned ?? false}
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
