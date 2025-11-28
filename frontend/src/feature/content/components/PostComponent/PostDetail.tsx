import { useCallback, useEffect, useState } from "react";
import { X } from "lucide-react";
import { CreatePostModal } from "../../../create/components/CreatePost/CreatePostModal";
import { PostDetailHeader } from "./PostDetailHeader";
import { PostDetailMain } from "./PostDetailMain";
import { PostMediaGallery } from "./PostMediaGallery";
import { MiniPostDetail } from "./MiniPostDetail";
import type { FullContentDto, UserDto } from "@/service/api";
import useContentService from "@/shared/hooks/useContentService";
import useUserService from "@/shared/hooks/useUserService";

interface PostDetailComponentProps {
  post: FullContentDto;
  onClose: () => void;
  posts: FullContentDto[] | null;
}

export function PostDetailComponent({
  post,
  onClose,
}: PostDetailComponentProps) {
  const [liked, setLiked] = useState(false);
  const [followed, setFollowed] = useState(false);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [userData, setUserdata] = useState<UserDto | null>(null);
  const [ancestors, setAncestors] = useState<FullContentDto[]>([]);
  const { getAncestorPost } = useContentService();
  const { findUserById } = useUserService();

  const getAncestors = async () => {
    const res = await getAncestorPost(post.content_id, post.area_id);
    if (res) setAncestors(res);
  };

  const handlePrevMedia = () => {
    setCurrentMediaIndex((prev) =>
      prev === 0 ? post.contents.length - 1 : prev - 1
    );
  };

  const handleNextMedia = () => {
    setCurrentMediaIndex((prev) =>
      prev === post.contents.length - 1 ? 0 : prev + 1
    );
  };

  const handleClickOutside = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement)?.id === "post-detail-backdrop") {
      onClose();
    }
  };

  useEffect(() => {
    getAncestors();
  }, [post.content_id, post.area_id]);

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

  useEffect(() => {
    fetchUserData(post.creator_id);
  }, [post.creator_id]);

  return (
    <div
      id="post-detail-backdrop"
      onClick={handleClickOutside}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
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
          {/* Ancestor Posts Chain */}
          {ancestors.length > 0 && (
            <div className="space-y-2 pb-4 border-b border-dark-700">
              <h4 className="text-xs font-semibold text-gray-400 uppercase">
                Replying to:
              </h4>
              <div className="space-y-2">
                {ancestors.map((ancestor) => (
                  <MiniPostDetail key={ancestor.content_id} post={ancestor} />
                ))}
              </div>
            </div>
          )}

          <PostMediaGallery
            mediaItems={post.contents}
            currentMediaIndex={currentMediaIndex}
            onPrevMedia={handlePrevMedia}
            onNextMedia={handleNextMedia}
            title={post.title}
          />

          {userData && (
            <PostDetailHeader
              creator={userData}
              followed={followed}
              onFollowClick={() => setFollowed(!followed)}
            />
          )}

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
            </div>
          </div>
        </div>
      </div>

      <CreatePostModal
        isOpen={showCreatePost}
        onClose={() => setShowCreatePost(false)}
        parentPostId={post.content_id}
        currentUserId={post.creator_id}
        currentAreaId={post.area_id}
      />
    </div>
  );
}
