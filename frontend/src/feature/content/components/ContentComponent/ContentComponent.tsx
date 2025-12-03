import { useState } from "react";
import { ContentHeaderInfo } from "./ContentHeaderInfo";
import { ContentDetailInfo } from "./ContentDetailInfo";
import { ContentDetailComponent } from "./ContentDetail";
import type { FullContentDto, UserDto } from "@/service/api";
import { useAuthContext } from "@/feature/auth/context/AuthContext";

interface ContentComponentProps {
  content: FullContentDto;
  liked: boolean;
}

export function ContentComponent({ content, liked }: ContentComponentProps) {
  const [showDetail, setShowDetail] = useState(false);
  const [like, setLike] = useState(content.likes);
  const [comment, setComment] = useState(content.comments);
  const { user } = useAuthContext();
  const [likedState, setLikedState] = useState(liked);

  return (
    <>
      <div
        onClick={() => setShowDetail(true)}
        className="bg-dark-800 rounded-lg overflow-hidden cursor-pointer hover:shadow-lg hover:shadow-burgundy-500/20 transition-all group w-full"
      >
        {/* DONT CARE ABOUT THIS SHIT */}
        <ContentHeaderInfo
          post_type={content.post_type}
          content_id={content.content_id}
          thumbnail={
            content.thumbnail
              ? content.thumbnail.filepath
              : "http://localhost:3000/uploads/profile/1763906830326-69740177.png"
          }
        />

        {/* footer  */}
        <ContentDetailInfo
          title={content.title}
          likes={like}
          liked={likedState}
          comments={comment}
          creator={user ? user.username : "anonymous"}
          creatorProfile={
            user
              ? user.profile_picture
              : "http://localhost:3000/uploads/profile/1763906830326-69740177.png"
          }
        />
      </div>

      {showDetail && (
        <ContentDetailComponent
          content={content}
          onClose={() => {
            setShowDetail(false);
          }}
          onlikedChange={setLikedState}
          onCommentClick={setComment}
          onLikeClick={setLike}
        />
      )}
    </>
  );
}
