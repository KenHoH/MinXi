import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { MoreVertical } from "lucide-react";
import RootLayout from "@/app/LayoutPage";
import { Masonry } from "@/shared/components/Masonry";
import { Card, CardContent } from "@/components/ui/card";
import { ContentComponent } from "@/feature/content/components/ContentComponent/ContentComponent";
import { PostComponent } from "@/feature/content/components/PostComponent/PostComponent";
import {
  type BoardDto,
  type UserDto,
  type FullContentDto,
} from "@/service/api";
import useUserService from "@/shared/hooks/useUserService";
import useContentService from "@/shared/hooks/useContentService";
import useBoardService from "@/shared/hooks/useBoardService";
import { useAuthContext } from "@/feature/auth/context/AuthContext";
import { useParams } from "react-router";

const tabs = [
  { id: "content", label: "Content" },
  { id: "saved", label: "Saved" },
  { id: "liked", label: "Liked" },
  { id: "boards", label: "Boards" },
];

export default function ProfilePageCopy() {
  const [activeTab, setActiveTab] = useState<
    "content" | "saved" | "liked" | "boards"
  >("content");
  const [selectedBoard, setSelectedBoard] = useState<BoardDto | null>(null);

  // ============ AUTH & CONTEXT ============
  const { user } = useAuthContext();
  const { username } = useParams();
  const { findUserById, findByUsername } = useUserService();
  const { getPinnedByUser, getLikedByUser, getByUserAll, getByUser } =
    useContentService();
  const { getBoardByUser, getContentByBoardId } = useBoardService();

  // ============ USER DATA STATE ============
  const [loggedUserData, setLoggedUserData] = useState<UserDto | null>(null);
  const [creatorUserData, setCreatorUserData] = useState<UserDto | null>(null);
  const [owned, setOwned] = useState(false);

  const [boardItems, setBoardItems] = useState<FullContentDto[]>([]);

  // ============ CONTENT STATE ============
  const [contentItems, setContentItems] = useState<FullContentDto[]>([]);
  const [savedItems, setSavedItems] = useState<FullContentDto[]>([]);
  const [likedItems, setLikedItems] = useState<FullContentDto[]>([]);
  const [boards, setBoards] = useState<BoardDto[]>([]);

  const getUserData = async () => {
    if (user) {
      const res = await findUserById(user.user_id);
      if (res) {
        setLoggedUserData(res);
      }
    }
    if (username) {
      const res = await findByUsername(username, loggedUserData?.area_id || 0);
      if (res) {
        const response = await findUserById(res.user_id);
        if (response) {
          setCreatorUserData(response);
        }
      }
    }
  };

  useEffect(() => {
    getUserData();
  }, [user, username, loggedUserData?.area_id]);

  useEffect(() => {
    if (loggedUserData && creatorUserData) {
      if (loggedUserData?.user_id === creatorUserData?.user_id) {
        setOwned(true);
      } else {
        setOwned(false);
      }
    }
  }, [loggedUserData, creatorUserData]);

  // ============ FETCH CONTENT BASED ON OWNERSHIP ============
  const fetchContent = async () => {
    if (!creatorUserData) return;

    try {
      if (owned) {
        // If owned profile: fetch all content types
        const pinnedContent = await getPinnedByUser(creatorUserData.user_id);
        const likedContent = await getLikedByUser(creatorUserData.user_id);
        const allContent = await getByUserAll(creatorUserData.user_id);

        setContentItems(allContent || []);
        setSavedItems(pinnedContent || []);
        setLikedItems(likedContent || []);
      } else {
        // If not owned profile: show public content
        const pinned = (await getPinnedByUser(creatorUserData.user_id)) || [];
        const liked = (await getLikedByUser(creatorUserData.user_id)) || [];
        const publicContent = (await getByUser(creatorUserData.user_id)) || [];

        setContentItems(publicContent);
        setSavedItems(pinned);
        setLikedItems(liked);
      }
    } catch (error) {
      console.error("Failed to fetch content:", error);
    }
  };

  // ============ FETCH BOARDS ============
  const fetchBoards = async () => {
    if (!creatorUserData || !loggedUserData) return;

    try {
      const fetchedBoards = await getBoardByUser(
        creatorUserData.user_id,
        loggedUserData.area_id
      );

      if (fetchedBoards) {
        // Filter boards: if owned, show all; if not owned, show only public boards
        const filteredBoards = owned
          ? fetchedBoards
          : fetchedBoards.filter((board) => !board.visibilityPrivate);

        setBoards(filteredBoards);
      }
    } catch (error) {
      console.error("Failed to fetch boards:", error);
    }
  };

  useEffect(() => {
    if (creatorUserData) {
      fetchContent();
      fetchBoards();
    }
  }, [creatorUserData, owned]);

  useEffect(() => {
    const getContentByBoard = async () => {
      if (selectedBoard && creatorUserData) {
        const contents = await getContentByBoardId(
          selectedBoard.board_id,
          creatorUserData?.area_id
        );
        if (contents) {
          setBoardItems(contents);
        }
      }
    };
    getContentByBoard();
  }, [selectedBoard, creatorUserData]);

  const renderContentMasonry = (items: FullContentDto[]) => {
    const renderItem = (item: FullContentDto) => {
      const isPost = item.post_type === "post";
      const isContent =
        item.post_type === "image" || item.post_type === "video";

      if (isContent) {
        return <ContentComponent key={item.content_id} content={item} />;
      } else if (isPost) {
        return <PostComponent key={item.content_id} post={item} />;
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

  const renderBoardsMasonry = (items: BoardDto[]) => (
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
                {creatorUserData && (
                  <>
                    <div className="flex-1">
                      <div className="flex items-center justify-center gap-4">
                        <h1 className="text-2xl font-bold text-foreground">
                          {creatorUserData?.username || "Anonymous"}
                        </h1>
                        <button className="text-muted-foreground hover:text-foreground">
                          <MoreVertical className="w-5 h-5" />
                        </button>
                      </div>
                      <p className="text-sm text-foreground/50 mt-2">
                        {creatorUserData.desc}
                      </p>
                    </div>
                    <div className="flex gap-8 justify-center text-sm">
                      <div>
                        <p className="text-lg font-bold text-foreground">
                          {creatorUserData?.total_reports}
                        </p>
                        <p className="text-muted-foreground">Reports</p>
                      </div>
                      <div>
                        <p className="text-lg font-bold text-foreground">
                          {creatorUserData?.follower}
                        </p>
                        <p className="text-muted-foreground">Followers</p>
                      </div>
                      <div>
                        <p className="text-lg font-bold text-foreground">
                          {creatorUserData?.total_like}
                        </p>
                        <p className="text-muted-foreground">Likes</p>
                      </div>
                    </div>
                  </>
                )}

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
              {/* Board Header - Show when viewing board contents */}
              {activeTab === "boards" && selectedBoard && (
                <div className="mb-8 pb-8 border-b border-border/50">
                  <button
                    onClick={() => setSelectedBoard(null)}
                    className="text-burgundy-600 hover:text-burgundy-500 text-sm font-medium mb-4 flex items-center gap-2"
                  >
                    Back to Boards
                  </button>
                  <h2 className="text-3xl font-bold text-foreground mb-2">
                    {selectedBoard.title}
                  </h2>
                  <p className="text-foreground/60">
                    {selectedBoard.description || "No description"}
                  </p>
                  <div className="text-sm text-gray-500 mt-2">
                    {boardItems.length} items
                  </div>
                </div>
              )}

              {activeTab === "content" &&
                contentItems.length > 0 &&
                renderContentMasonry(contentItems)}
              {activeTab === "saved" &&
                savedItems.length > 0 &&
                renderContentMasonry(savedItems)}
              {activeTab === "liked" &&
                likedItems.length > 0 &&
                renderContentMasonry(likedItems)}
              {activeTab === "boards" &&
                selectedBoard === null &&
                boards.length > 0 &&
                renderBoardsMasonry(boards)}
              {activeTab === "boards" &&
                selectedBoard !== null &&
                boardItems.length > 0 &&
                renderContentMasonry(boardItems)}

              {/* Empty State */}
              {((activeTab === "content" && contentItems.length === 0) ||
                (activeTab === "saved" && savedItems.length === 0) ||
                (activeTab === "liked" && likedItems.length === 0) ||
                (activeTab === "boards" &&
                  selectedBoard === null &&
                  boards.length === 0) ||
                (activeTab === "boards" &&
                  selectedBoard !== null &&
                  boardItems.length === 0)) && (
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
    </RootLayout>
  );
}
