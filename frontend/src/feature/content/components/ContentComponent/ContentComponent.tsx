import { useEffect, useState } from "react";
import { ContentHeaderInfo } from "./ContentHeaderInfo";
import { ContentDetailInfo } from "./ContentDetailInfo";
import { ContentDetailComponent } from "./ContentDetail";
import type { FullContentWithHistoryProps } from "../models/FullContentWithHistory";
import type { CreateHistoryDto } from "@/service/api";
import useHistoryService from "@/shared/hooks/useHistoryService";

interface ContentComponentProps {
  content: FullContentWithHistoryProps;
  liked?: boolean;
  pinned?: boolean;
}

export function ContentComponent({
  content,
  liked,
  pinned,
}: ContentComponentProps) {
  const [showDetail, setShowDetail] = useState(false);
  const [like, setLike] = useState(content.likes);
  const [comment, setComment] = useState(content.comments);
  const [pins, setPins] = useState(content.pins);
  const [likedState, setLikedState] = useState(liked);
  const [pinnedState, setPinnedState] = useState(pinned);
  const { getByUserAndContent } = useHistoryService();
  const [history, setHistory] = useState<CreateHistoryDto>();

  useEffect(() => {
    const fetchHistoryUser = async () => {
      const histories = await getByUserAndContent(
        content.creator_id,
        content.content_id
      );
      if (histories) setHistory(histories);
    };
    fetchHistoryUser();
  }, []);

  return (
    <>
      <div
        onClick={() => setShowDetail(true)}
        className="bg-dark-800 rounded-lg overflow-hidden cursor-pointer hover:shadow-lg hover:shadow-burgundy-500/20 transition-all group w-full border border-dark-700"
      >
        {/* DONE */}
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
          liked={likedState ?? history?.liked ?? false}
          comments={comment}
          pinned={pinnedState ?? history?.pinned ?? false}
          pins={pins}
          creator={content.username}
          creatorProfile={
            content.profile_url
              ? content.profile_url
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
          liked={likedState ?? history?.liked ?? false}
          pinned={pinnedState ?? history?.pinned ?? false}
          likes={like}
          pins={pins}
          comments={comment}
          reports={content.reports}
          onLikeClick={setLike}
          onPinClick={setPins}
          onCommentClick={setComment}
          onlikedChange={setLikedState}
          onpinnedChange={setPinnedState}
        />
      )}
    </>
  );
}
