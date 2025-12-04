import React, {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";
import type { FullContentDto } from "@/service/api";
import { ContentDetailComponent } from "@/feature/content/components/ContentComponent/ContentDetail";

interface ContentDetailContextType {
  showContentDetail: (content: FullContentDto) => void;
  hideContentDetail: () => void;
}

const ContentDetailContext = createContext<
  ContentDetailContextType | undefined
>(undefined);

export const ContentDetailProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [content, setContent] = useState<FullContentDto | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const showContentDetail = (content: FullContentDto) => {
    setContent(content);
    setIsOpen(true);
  };

  const hideContentDetail = () => {
    setIsOpen(false);
    setTimeout(() => setContent(null), 300);
  };

  return (
    <ContentDetailContext.Provider
      value={{ showContentDetail, hideContentDetail }}
    >
      {children}
      {isOpen && content && (
        <ContentDetailComponent
          content={content}
          onClose={hideContentDetail}
          onLikeClick={(newLike) => {
            if (content) {
              setContent({ ...content, likes: newLike });
            }
          }}
          onCommentClick={(newComment) => {
            if (content) {
              setContent({ ...content, comments: newComment });
            }
          }}
          onlikedChange={(liked) => {
            // Optional: handle liked state change if needed
          }}
        />
      )}
    </ContentDetailContext.Provider>
  );
};

export const useContentDetail = () => {
  const context = useContext(ContentDetailContext);
  if (!context) {
    throw new Error(
      "useContentDetail must be used within a ContentDetailProvider"
    );
  }
  return context;
};
