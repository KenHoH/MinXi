import { useEffect, useEffectEvent, useState } from "react";
import { ContentHeaderInfo } from "./ContentHeaderInfo";
import { ContentDetailInfo } from "./ContentDetailInfo";
import { ContentDetailComponent } from "./ContentDetail";
import type { FullContentDto, UserDto } from "@/service/api";
import useUserService from "@/shared/hooks/useUserService";

interface ContentComponentProps {
  content: FullContentDto;
}

export function ContentComponent({ content }: ContentComponentProps) {
  const [showDetail, setShowDetail] = useState(false);
  const [like, setLike] = useState(content.likes);
  const [comment, setComment] = useState(content.comments);

  return (
    <>
      <div
        onClick={() => setShowDetail(true)}
        className="bg-dark-800 rounded-lg overflow-hidden cursor-pointer hover:shadow-lg hover:shadow-burgundy-500/20 transition-all group w-full"
      >
        <ContentHeaderInfo // DONE
          post_type={content.post_type}
          content_id={content.content_id}
          thumbnail={content.thumbnail.filepath}
        />
 
        <ContentDetailInfo // DONE
          title={content.title}
          likes={like}
          comments={comment}
        />
      </div>

      {showDetail && (
        <ContentDetailComponent
          content={content}
          onClose={() => {
            setShowDetail(false);
          }}
          onCommentClick={setComment}
          onLikeClick={setLike}
        />
      )}
    </>
  );
}
