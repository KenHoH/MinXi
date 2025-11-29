import { useCallback, useEffect, useState } from "react";
import { ContentTable } from "../components/ContentTable";
import { PostTable } from "../components/PostTable";
import { BoardTable } from "../components/BoardTable";
import RootLayout from "@/app/LayoutPage";
import { useToast } from "@/shared/context/ToastContext";
import { useAuthContext } from "@/feature/auth/context/AuthContext";
import useContentService from "@/shared/hooks/useContentService";
import type { BoardDto, FullContentDto } from "@/service/api";
import useBoardService from "@/shared/hooks/useBoardService";

export default function CreatePage() {
  const [activeTab, setActiveTab] = useState<"content" | "post" | "board">(
    "content"
  );
  const [contentItems, setContentItems] = useState<FullContentDto[]>([]);
  const [postItems, setPostItems] = useState<FullContentDto[]>([]);
  const [boardItems, setBoardItems] = useState<BoardDto[]>([]);
  const { showToast } = useToast();
  const { user } = useAuthContext();

  const { getByUserAll } = useContentService();
  const { getBoardByUser } = useBoardService();

  const getContentByUser = useCallback(async (userId: number) => {
    const res = await getByUserAll(userId);

    if (res) {
      const posts = res.filter((item) => item.post_type === "post");
      const contents = res.filter((item) => item.post_type !== "post");
      setPostItems(posts);
      setContentItems(contents);
    } else {
      showToast("Failed To Load User's Content");
    }
  }, []);
  const getBoardsByUser = useCallback(
    async (userId: number, areaId: number) => {
      const res = await getBoardByUser(userId, areaId);

      if (res) {
        setBoardItems(res);
      } else {
        showToast("Failed To Load User's Content");
      }
    },
    []
  );

  useEffect(() => {
    if (!user || !user.user_id) {
      showToast("User not logged in.");
      return;
    }
    getContentByUser(user.user_id);
    getBoardsByUser(user.user_id, user.area_id);
  }, [user]);

  const handleDeleteContent = (id: number) => {
    setContentItems(
      contentItems.filter((item: FullContentDto) => item.content_id !== id)
    );
  };

  const handleDeletePost = (id: number) => {
    setPostItems(
      postItems.filter((item: FullContentDto) => item.content_id !== id)
    );
  };

  const handleDeleteBoard = (id: number) => {
    setBoardItems(boardItems.filter((item: BoardDto) => item.board_id !== id));
  };

  return (
    <RootLayout>
      <div className="w-full h-full bg-dark-900">
        <div className="p-8">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-100 mb-8">Create</h1>

            {/* Tabs */}
            <div className="flex gap-2 border-b border-dark-700 mb-8">
              {(["content", "post", "board"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-3 font-medium transition-colors border-b-2 ${
                    activeTab === tab
                      ? "border-burgundy-600 text-burgundy-400"
                      : "border-transparent text-gray-400 hover:text-gray-200"
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>

            {activeTab === "content" && (
              <ContentTable
                items={contentItems}
                onDelete={handleDeleteContent}
              />
            )}

            {activeTab === "post" && (
              <PostTable
                items={postItems}
                onRefreshChild={() => getContentByUser(user?.user_id || 0)}
                onDelete={handleDeletePost}
              />
            )}

            {activeTab === "board" && (
              <BoardTable items={boardItems} onDelete={handleDeleteBoard} />
            )}
          </div>
        </div>
      </div>
    </RootLayout>
  );
}
