import { useCallback, useEffect, useMemo, useState } from "react";
import FeedList from "@/feature/feed/components/FeedList";
import { TopFeedBar } from "@/feature/feed/components/TopFeedBar";
import RootLayout from "@/app/LayoutPage";
import type { FullContentDto } from "@/service/api/models/FullContentDto";
import { useAuthContext } from "@/feature/auth/context/AuthContext";
import useBoardService from "@/shared/hooks/useBoardService";
import type { UserDto, BoardDto, PageContentRes } from "@/service/api";
import useUserService from "@/shared/hooks/useUserService";
import useContentService from "@/shared/hooks/useContentService";
import useAlgorithmService from "@/shared/hooks/useAlgorithmService";

export default function FeedPage() {
  const [currentFilter, setCurrentFilter] = useState("All");
  const [userBoards, setUserBoards] = useState<BoardDto[]>([]);
  const [boardContentsMap, setBoardContentsMap] = useState<
    Map<number, FullContentDto[]>
  >(new Map());
  const [loggedUser, setLoggedUser] = useState<UserDto | null>(null);

  const [allCursor, setAllCursor] = useState(0);
  const [fypCursor, setFypCursor] = useState(0);
  const [friendCursor, setFriendCursor] = useState(0);
  const [followingCursor, setFollowingCursor] = useState(0);

  const { user } = useAuthContext();
  const { getBoardByUser, getContentByBoardId } = useBoardService();
  const { findUserById } = useUserService();
  const { findAllGlobalPage, getFollowingContent, getFriendContent } =
    useContentService();
  const { findFyp } = useAlgorithmService();

  const fetchUserData = useCallback(async () => {
    if (user) {
      const res = await findUserById(user.user_id);
      if (res) {
        setLoggedUser(res);
      }
    }
  }, [user]);

  const fetchUserBoards = useCallback(async () => {
    if (loggedUser) {
      const boards = await getBoardByUser(
        loggedUser.user_id,
        loggedUser.area_id
      );
      if (boards && boards.length > 0) {
        setUserBoards(boards);
      } else {
        setUserBoards([]);
      }
    }
  }, [loggedUser]);

  const fetchBoardContent = useCallback(
    async (boardId: number) => {
      if (loggedUser) {
        const content = await getContentByBoardId(boardId, loggedUser.area_id);
        if (content) {
          setBoardContentsMap((prev) => new Map(prev).set(boardId, content));
        }
      }
    },
    [loggedUser, getContentByBoardId]
  );

  const filters = useMemo(() => {
    if (!loggedUser) return ["All"];

    const boardNames = userBoards.map((board) => board.title);
    return ["All", "Following", "Friends", ...boardNames];
  }, [loggedUser, userBoards]);

  const handleFilterChange = (filter: string) => {
    setCurrentFilter(filter);

    if (filter !== "All" && filter !== "Following" && filter !== "Friends") {
      const board = userBoards.find((b) => b.title === filter);
      if (board) {
        fetchBoardContent(board.board_id);
      }
    }
  };

  const handleLoadMore = useCallback(async () => {
    if (!loggedUser) {
      const response = await findAllGlobalPage(1, allCursor, 10);
      let allContent: FullContentDto[] = [];
      if (response) {
        allContent = response.contents;
        setAllCursor(response.currentPage || 0);
      }
      return allContent || [];
    }

    let result: FullContentDto[] | null = [];
    let response: PageContentRes | null = null;
    if (currentFilter === "All") {
      response = await findFyp(loggedUser.area_id, fypCursor).then(
        (res) => res || null
      );
      if (response) {
        result = response.contents;
        setFypCursor(response.currentPage || 0);
      }
    } else if (currentFilter === "Following") {
      response = await getFollowingContent(
        loggedUser.user_id,
        loggedUser.area_id,
        followingCursor
      );
      if (response) {
        result = response.contents;
        setFollowingCursor(response.currentPage || 0);
      }
    } else if (currentFilter === "Friends") {
      response = await getFriendContent(
        loggedUser.user_id,
        loggedUser.area_id,
        friendCursor
      );
      if (response) {
        result = response.contents;
        setFriendCursor(response.currentPage || 0);
      }
    } else {
      const board = userBoards.find((b) => b.title === currentFilter);
      console.log("Loading content for board filter:", currentFilter, board);
      if (board) {
        result = boardContentsMap.get(board.board_id) || [];
      }
    }

    return result || [];
  }, [loggedUser, currentFilter, userBoards, boardContentsMap]);

  const isBoardFilter = userBoards.some((b) => b.title === currentFilter);
  const enableInfiniteScroll = !isBoardFilter;

  useEffect(() => {
    fetchUserData();
  }, []);

  useEffect(() => {
    if (loggedUser) {
      fetchUserBoards();
    }
  }, [loggedUser]);

  useEffect(() => {
    if (userBoards.length > 0) {
      userBoards.forEach((board) => {
        if (board.board_id) {
          fetchBoardContent(board.board_id);
        }
      });
    }
  }, [userBoards]);

  useEffect(() => {
    console.log("Current filter changed to:", currentFilter);
  }, [currentFilter]);

  return (
    <RootLayout>
      <div className="w-full h-full bg-dark-900 flex flex-col justify-start items-center">
        <div className="w-3/4 pt-4">
          <TopFeedBar filters={filters} onFilterChange={handleFilterChange} />
        </div>
        <FeedList
          onLoadMore={handleLoadMore}
          currentFilter={currentFilter}
          enableInfiniteScroll={enableInfiniteScroll}
        />
      </div>
    </RootLayout>
  );
}
