import { useState } from "react";
import { Button } from "@/components/ui/button";
import { MoreVertical } from "lucide-react";
import RootLayout from "@/app/LayoutPage";
import { Masonry } from "@/shared/components/Masonry";
import { Card, CardContent } from "@/components/ui/card";
import { ContentComponent } from "@/feature/content/components/ContentComponent/ContentComponent";
import { PostComponent } from "@/feature/content/components/PostComponent/PostComponent";
import { BoardModal } from "@/feature/create/components/BoardModal";

const dummyUserInfo = {
  username: "Ken Neth",
  userId: "9530287815",
  description: "No description yet",
  following: 0,
  followers: 0,
  likesAndSaves: 0,
};

// Mock data for content (posts + images/videos combined)
const mockContent: (ContentItem | PostItem)[] = [
  {
    content_id: 1,
    creator_id: 5,
    title: "Beautiful Landscape",
    post_type: "image",
    thumbnail:
      "http://localhost:3000/uploads/thumbnail/1763296139023-929553449.jpg",
    likes: 10,
    comments: 2,
    views: 45,
  },
  {
    content_id: 2,
    creator_id: 5,
    title: "My thoughts on photography",
    post_type: "post",
    description: "Photography is all about capturing moments...",
    likes: 15,
    comments: 3,
  },
  {
    content_id: 3,
    creator_id: 5,
    title: "Sunset Series",
    post_type: "video",
    thumbnail:
      "http://localhost:3000/uploads/thumbnail/1763296139023-929553449.jpg",
    likes: 20,
    comments: 5,
    views: 80,
  },
  {
    content_id: 4,
    creator_id: 5,
    title: "Mountain Adventure",
    post_type: "image",
    thumbnail:
      "http://localhost:3000/uploads/thumbnail/1763296139023-929553449.jpg",
    likes: 12,
    comments: 2,
    views: 50,
  },
  {
    content_id: 5,
    creator_id: 5,
    title: "Check out this cool place!",
    post_type: "post",
    description: "Found this amazing hiking trail...",
    likes: 25,
    comments: 8,
  },
  {
    content_id: 6,
    creator_id: 5,
    title: "City Lights",
    post_type: "video",
    thumbnail:
      "http://localhost:3000/uploads/thumbnail/1763296139023-929553449.jpg",
    likes: 18,
    comments: 4,
    views: 65,
  },
];

// Mock data for saved content (pinned by user)
const mockSavedContent: (ContentItem | PostItem)[] = [
  {
    content_id: 7,
    creator_id: 5,
    title: "My Favorite Sunset",
    post_type: "image",
    thumbnail:
      "http://localhost:3000/uploads/thumbnail/1763296139023-929553449.jpg",
    likes: 30,
    comments: 7,
    views: 120,
  },
  {
    content_id: 8,
    creator_id: 5,
    title: "Travel Video",
    post_type: "post",
    description: "My travel experience was amazing...",
    likes: 40,
    comments: 12,
  },
  {
    content_id: 9,
    creator_id: 5,
    title: "Vintage Photography",
    post_type: "video",
    thumbnail:
      "http://localhost:3000/uploads/thumbnail/1763296139023-929553449.jpg",
    likes: 22,
    comments: 5,
    views: 95,
  },
];

// Mock data for liked content
const mockLikedContent: (ContentItem | PostItem)[] = [
  {
    content_id: 10,
    creator_id: 5,
    title: "Amazing Artwork",
    post_type: "image",
    thumbnail:
      "http://localhost:3000/uploads/thumbnail/1763296139023-929553449.jpg",
    likes: 50,
    comments: 15,
    views: 200,
  },
  {
    content_id: 11,
    creator_id: 5,
    title: "This is so cool!",
    post_type: "post",
    description: "Found this incredible tutorial today...",
    likes: 35,
    comments: 10,
  },
  {
    content_id: 12,
    creator_id: 5,
    title: "Inspiration Gallery",
    post_type: "image",
    thumbnail:
      "http://localhost:3000/uploads/thumbnail/1763296139023-929553449.jpg",
    likes: 28,
    comments: 6,
    views: 110,
  },
  {
    content_id: 13,
    creator_id: 5,
    title: "Creative Series",
    post_type: "video",
    thumbnail:
      "http://localhost:3000/uploads/thumbnail/1763296139023-929553449.jpg",
    likes: 45,
    comments: 11,
    views: 180,
  },
];

// Mock data for boards
const mockBoards: BoardItem[] = [
  {
    board_id: 1,
    board_thumbnail:
      "http://localhost:3000/uploads/thumbnail/1763296139023-929553449.jpg",
    creator_id: 1,
    title: "Travel Collection",
    description: "All my favorite travel photos",
    visibilityPrivate: false,
    created_at: "2025-11-23",
    contents: mockContent.slice(0, 3) as ContentItem[],
  },
  {
    board_id: 2,
    board_thumbnail:
      "http://localhost:3000/uploads/thumbnail/1763296139023-929553449.jpg",
    creator_id: 1,
    title: "Photography Tips",
    description: "Best practices and tutorials",
    visibilityPrivate: false,
    created_at: "2025-11-23",
    contents: mockContent.slice(3, 6) as ContentItem[],
  },
  {
    board_id: 3,
    board_thumbnail:
      "http://localhost:3000/uploads/thumbnail/1763296139023-929553449.jpg",
    creator_id: 1,
    title: "Inspiration",
    description: "Random creative inspiration",
    visibilityPrivate: true,
    created_at: "2025-11-23",
    contents: mockLikedContent.slice(0, 2) as ContentItem[],
  },
];

const tabs = [
  { id: "content", label: "Content" },
  { id: "saved", label: "Saved" },
  { id: "liked", label: "Liked" },
  { id: "boards", label: "Boards" },
];

interface ContentItem {
  content_id: number;
  creator_id: number;
  title: string;
  post_type: "image" | "video";
  thumbnail: string;
  likes: number;
  comments: number;
  views: number;
}

interface PostItem {
  content_id: number;
  creator_id: number;
  title: string;
  post_type: "post";
  description: string;
  likes: number;
  comments: number;
}

type FeedItem = ContentItem | PostItem;

interface BoardItem {
  board_id: number;
  board_thumbnail: string;
  creator_id: number;
  title: string;
  description: string;
  visibilityPrivate: boolean;
  created_at: string;
  contents: FeedItem[];
}

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<
    "content" | "saved" | "liked" | "boards"
  >("content");
  const [selectedBoard, setSelectedBoard] = useState<BoardItem | null>(null);

  const renderContentMasonry = (items: FeedItem[]) => {
    const renderItem = (item: FeedItem) => {
      const isPost = item.post_type === "post";
      const isContent =
        item.post_type === "image" || item.post_type === "video";

      if (isContent) {
        return (
          <ContentComponent
            key={item.content_id}
            content={item as ContentItem}
          />
        );
      } else if (isPost) {
        return <PostComponent key={item.content_id} post={item as PostItem} />;
      }

      return null;
    };

    return (
      <div
        style={{
          columnCount: 4,
          columnGap: "1rem",
        }}
      >
        {items.map((item) => (
          <div
            key={`${item.post_type}-${item.content_id}`}
            className="mb-4"
            style={{
              breakInside: "avoid",
              pageBreakInside: "avoid",
            }}
          >
            {renderItem(item)}
          </div>
        ))}
      </div>
    );
  };

  const renderBoardsMasonry = (items: BoardItem[]) => (
    <Masonry columns={4}>
      {items.map((item) => (
        <Card
          key={item.board_id}
          onClick={() => setSelectedBoard(item)}
          className="bg-dark-800 border border-dark-700 cursor-pointer hover:border-burgundy-600 hover:shadow-lg hover:shadow-burgundy-500 transition-all"
        >
          <CardContent className="pt-6">
            <div className="aspect-square bg-dark-700 rounded mb-3 flex items-center justify-center overflow-hidden">
              <img
                src={item.board_thumbnail}
                alt={item.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
            </div>
            <h3 className="font-medium text-gray-100 mb-2">{item.title}</h3>
            <p className="text-xs text-gray-400 mb-4 line-clamp-2">
              {item.description || "No description"}
            </p>
            <div className="text-xs text-gray-500 mb-3">
              {item.contents?.length || 0} items
            </div>
          </CardContent>
        </Card>
      ))}
    </Masonry>
  );

  return (
    <RootLayout>
      <div className="flex">
        <main className="ml-20 flex-1 min-h-screen bg-background">
          {/* Profile Header */}
          <div className="max-w-4xl mx-auto">
            <div className="pt-12 pb-8 px-8 border-b border-border/50">
              <div className="flex flex-col items-center gap-6 text-center">
                {/* Avatar */}
                <div className="w-32 h-32 rounded-full bg-white p-1 shrink-0">
                  <div className="w-full h-full rounded-full bg-linear-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                    <svg
                      className="w-12 h-12 text-white"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zm-5.04-6.71l-2.75 3.54h2.75l2.75-3.54-2.75-3.54h-2.75l2.75 3.54z" />
                    </svg>
                  </div>
                </div>

                {/* User Info */}
                <div className="flex-1">
                  <div className="flex items-center justify-center gap-4">
                    <h1 className="text-2xl font-bold text-foreground">
                      {dummyUserInfo.username}
                    </h1>
                    <button className="text-muted-foreground hover:text-foreground">
                      <MoreVertical className="w-5 h-5" />
                    </button>
                  </div>
                  <p className="text-sm text-foreground/60 mt-2">
                    User ID: {dummyUserInfo.userId}
                  </p>
                  <p className="text-sm text-foreground/50 mt-2">
                    {dummyUserInfo.description}
                  </p>
                </div>

                {/* Stats */}
                <div className="flex gap-8 justify-center text-sm">
                  <div>
                    <p className="text-lg font-bold text-foreground">
                      {dummyUserInfo.following}
                    </p>
                    <p className="text-muted-foreground">Following</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-foreground">
                      {dummyUserInfo.followers}
                    </p>
                    <p className="text-muted-foreground">Followers</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-foreground">
                      {dummyUserInfo.likesAndSaves}
                    </p>
                    <p className="text-muted-foreground">Likes & Saves</p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 mt-6">
                  <Button className="bg-primary text-background hover:bg-primary/90">
                    Edit Profile
                  </Button>
                  <Button
                    variant="outline"
                    className="border-border text-foreground bg-transparent"
                  >
                    Share
                  </Button>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex justify-center border-b border-border/50 px-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() =>
                    setActiveTab(
                      tab.id as "content" | "saved" | "liked" | "boards"
                    )
                  }
                  className={`px-6 py-4 font-medium text-sm border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? "border-primary text-foreground"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Content Area */}
            <div className="px-8 py-12">
              {activeTab === "content" &&
                mockContent.length > 0 &&
                renderContentMasonry(mockContent)}
              {activeTab === "saved" &&
                mockSavedContent.length > 0 &&
                renderContentMasonry(mockSavedContent)}
              {activeTab === "liked" &&
                mockLikedContent.length > 0 &&
                renderContentMasonry(mockLikedContent)}
              {activeTab === "boards" &&
                mockBoards.length > 0 &&
                renderBoardsMasonry(mockBoards)}

              {/* Empty State */}
              {((activeTab === "content" && mockContent.length === 0) ||
                (activeTab === "saved" && mockSavedContent.length === 0) ||
                (activeTab === "liked" && mockLikedContent.length === 0) ||
                (activeTab === "boards" && mockBoards.length === 0)) && (
                <div className="flex flex-col items-center justify-center py-20 px-8">
                  <div className="w-24 h-24 rounded-full border-2 border-muted/30 flex items-center justify-center mb-6">
                    <svg
                      className="w-12 h-12 text-muted-foreground"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1}
                        d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4"
                      />
                    </svg>
                  </div>
                  <p className="text-foreground/60 text-center">
                    No {activeTab} yet
                  </p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {selectedBoard && (
        <BoardModal
          board={selectedBoard}
          onClose={() => setSelectedBoard(null)}
          onDelete={() => {
            // Handle board deletion if needed
          }}
          showDeleteButton={false}
          canRemoveItems={false}
        />
      )}
    </RootLayout>
  );
}
