import { ContentComponent } from "@/feature/content/components/ContentComponent/ContentComponent";
import { PostComponent } from "@/feature/content/components/PostComponent/PostComponent";
import type { FullContentDto } from "@/service/api";

export const renderItem = (
  item: FullContentDto,
  liked: boolean,
  pinned: boolean
) => {
  const isPost = item.post_type === "post";
  const isContent = item.post_type === "image" || item.post_type === "video";

  if (isContent) {
    return (
      <ContentComponent
        key={item.content_id}
        content={item}
        liked={liked}
        pinned={pinned}
      />
    );
  } else if (isPost) {
    return (
      <PostComponent
        key={item.content_id}
        post={item}
        liked={liked}
        pinned={pinned}
      />
    );
  }

  return null;
};
