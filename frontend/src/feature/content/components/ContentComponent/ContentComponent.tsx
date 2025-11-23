import { useState } from "react";
import { ContentHeaderInfo } from "./ContentHeaderInfo";
import { ContentDetailInfo } from "./ContentDetailInfo";
import { ContentDetailComponent } from "./ContentDetail";
import type Content from "../../object/PublicContent";

interface ContentComponentProps {
  content: Content;
}

export function ContentComponent({ content }: ContentComponentProps) {
  const [showDetail, setShowDetail] = useState(false);

  return (
    <>
      <div
        onClick={() => setShowDetail(true)}
        className="bg-dark-800 rounded-lg overflow-hidden cursor-pointer hover:shadow-lg hover:shadow-burgundy-500/20 transition-all group w-full"
      >
        <ContentHeaderInfo
          post_type={content.post_type}
          content_id={content.content_id}
        />

        <ContentDetailInfo
          title={content.title}
          likes={content.likes}
          comments={content.comments}
        />
      </div>

      {showDetail && (
        <ContentDetailComponent
          content={content}
          onClose={() => setShowDetail(false)}
        />
      )}
    </>
  );
}
