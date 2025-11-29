import { useCallback, useEffect, useMemo, useState } from "react";
import FeedList from "@/feature/feed/components/FeedList";
import { TopFeedBar } from "@/feature/feed/components/TopFeedBar";
import RootLayout from "@/app/LayoutPage";
import type { FullContentDto } from "@/service/api/models/FullContentDto";
import { useAuthContext } from "@/feature/auth/context/AuthContext";
import useBoardService from "@/shared/hooks/useBoardService";
import type { UserDto } from "@/service/api";
import useUserService from "@/shared/hooks/useUserService";
import useContentService from "@/shared/hooks/useContentService";

export default function FeedPage() {
  const [contents, setContents] = useState<FullContentDto[]>([]);
  const [currentFilter, setCurrentFilter] = useState("All");
  const [userBoards, setUserBoards] = useState<Map<string, number>[]>([]);
  const [boardContents, setBoardContents] = useState<
    Map<number, FullContentDto[]>
  >(new Map());
  const [loggedUser, setLoggedUser] = useState<UserDto | null>(null);

  const { user } = useAuthContext();
  const { getBoardByUser } = useBoardService();
  const { findUserById } = useUserService();
  const { findAll, getFollowingContent, getFriendContent } =
    useContentService();

  const handleLoadMore = useCallback(
    async (page: number) => {
      await new Promise((resolve) => setTimeout(resolve, 500));
    },
    [currentFilter]
  );

  const handleFilterChange = (filter: string) => {
    setCurrentFilter(filter);
  };
  const filters = useMemo(() => {
    if (!user) return ["All"];
    const userBoardsStrings = userBoards.map((b) => b.keys().next().value);
    return ["All", "Following", "Friends", ...userBoardsStrings];
  }, [user, userBoards]);

  const fetchUserData = async () => {
    if (user) {
      const res = await findUserById(user.user_id);
      if (res) {
        setLoggedUser(res);
      }
    }
  };

  const fetchUserBoards = async () => {
    if (user) {
      const boards = await getBoardByUser(user.user_id, user.area_id);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [user]);

  useEffect(() => {}, [loggedUser]);

  return (
    <RootLayout>
      <div className="w-full h-full bg-dark-900 flex flex-col justify-start items-center">
        <div className="w-3/4 pt-4">
          <TopFeedBar filters={filters} onFilterChange={handleFilterChange} />
        </div>
        <FeedList onLoadMore={handleLoadMore} />
      </div>
    </RootLayout>
  );
}
