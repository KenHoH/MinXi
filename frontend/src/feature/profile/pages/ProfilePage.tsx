import { useEffect, useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import RootLayout from "@/app/LayoutPage";
import { ContentComponent } from "@/feature/content/components/ContentComponent/ContentComponent";
import { PostComponent } from "@/feature/content/components/PostComponent/PostComponent";
import { useNavigate, useParams } from "react-router";
import useUserService from "@/shared/hooks/useUserService";
import useContentService from "@/shared/hooks/useContentService";
import useBoardService from "@/shared/hooks/useBoardService";
import { useAuthContext } from "@/feature/auth/context/AuthContext";
import type { BoardDto, FullContentDto, UserDto } from "@/service/api";
import UserNotFoundPage from "@/feature/not-found/UserNotFoundPage";
import { useToast } from "@/shared/context/ToastContext";
import useConnectionService from "@/shared/hooks/useConnectionService";
import { ConnectionModal } from "@/feature/profile/components/ConnectionModal";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import useSocialService from "@/shared/hooks/useSocialService";
import type { Room } from "@/feature/chat/types";
import useNotification from "@/shared/logic/useNotificatoin";

export default function ProfilePage() {
  const { user } = useAuthContext();
  const { username } = useParams();

  const { findOneByUsername } = useUserService();
  const { getPinnedByUser, getLikedByUser, getByUserAll, getByUser } =
    useContentService();
  const { getBoardByUser, getContentByBoardId } = useBoardService();
  const { showToast } = useToast();
  const {
    getFollowingCount,
    getFollowersInstanceByCreator,
    getFollowingInstanceByUser,
    getFriendsInstanceByUser,
  } = useConnectionService();
  const navigate = useNavigate();
  const { createRoom } = useSocialService();
  const { checkFollow, createFollow, deleteFollow } = useConnectionService();
  const { updateFollowUser } = useUserService();
  const { sendNotificatonSystem } = useNotification();
  const [creatorUserData, setCreatorUserData] = useState<UserDto | null>(null);
  const [followerData, setFollowerData] = useState<UserDto[]>([]);
  const [followingData, setFollowingData] = useState<UserDto[]>([]);
  const [friendData, setFriendData] = useState<UserDto[]>([]);
  const [totalFollowing, setTotalFollowing] = useState(0);
  const [owned, setOwned] = useState(false);
  const [isFollowed, setIsFollowed] = useState(false);

  const [contentItems, setContentItems] = useState<FullContentDto[] | []>([]);
  const [savedItems, setSavedItems] = useState<FullContentDto[] | []>([]);
  const [likedItems, setLikedItems] = useState<FullContentDto[] | []>([]);
  const [boards, setBoards] = useState<BoardDto[] | []>([]);
  const [boardItems, setBoardItems] = useState<FullContentDto[] | []>([]);
  const [showConnectionModal, setShowConnectionModal] = useState(false);

  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [isLoadingContent, setIsLoadingContent] = useState(false);
  const [profileNotFound, setProfileNotFound] = useState(false);

  const goToSettings = () => {
    if (!user) return;
    navigate(`https://localhost:5173/settings/${user.username}`);
  };

  const handleSendMessage = async () => {
    if (!creatorUserData || !user) return;
    try {
      const room = await createRoom({
        members: [user.user_id, creatorUserData.user_id],
        room_type: "DIRECT",
      });
      if (room) {
        navigate(`https://localhost:5173/chat`);
      }
    } catch (error) {
      console.error("Failed to create chat room:", error);
      showToast("Failed to send message");
    }
  };

  const [activeTab, setActiveTab] = useState("");
  const handleShare = async () => {
    if (!creatorUserData) return;
    const link = `https://localhost:5173/profile/${creatorUserData.username}`;

    try {
      await navigator.clipboard.writeText(link);
      showToast("Link copied to clipboard!");
    } catch (err) {
      showToast("Failed to copy link");
    }
  };

  const handleFollow = async (shouldFollow: boolean) => {
    if (!user || !creatorUserData) return;

    try {
      if (shouldFollow) {
        await Promise.all([
          createFollow(creatorUserData.user_id, user.user_id),
          updateFollowUser(creatorUserData.user_id, { delta: 1 }),
        ]);
        sendNotificatonSystem(
          creatorUserData.user_id,
          user.user_id,
          `${user.username} started following you!`,
          "New Follower",
          "FOLLOW"
        );
        setIsFollowed(true);
      } else {
        await Promise.all([
          deleteFollow(creatorUserData.user_id, user.user_id),
          updateFollowUser(creatorUserData.user_id, { delta: -1 }),
        ]);
        setIsFollowed(false);
      }
    } catch (error) {
      console.error("Failed to update follow status:", error);
      showToast("Failed to update follow status");
    }
  };

  useEffect(() => {
    const checkFollowStatus = async () => {
      if (!user || owned || !creatorUserData) {
        setIsFollowed(false);
        return;
      }

      try {
        const isFollowing = await checkFollow(
          creatorUserData.user_id,
          user.user_id
        );
        setIsFollowed(isFollowing || false);
      } catch (error) {
        console.error("Failed to check follow status:", error);
        setIsFollowed(false);
      }
    };

    checkFollowStatus();
  }, [user, creatorUserData, owned]);

  useEffect(() => {
    const loadLoggedUser = async () => {
      if (!username || !user) return;

      setIsLoadingProfile(true);
      setProfileNotFound(false);

      try {
        const dto = await findOneByUsername(username, user.area_id);

        if (!dto) {
          setProfileNotFound(true);
          setCreatorUserData(null);
          return;
        }

        setCreatorUserData(dto);

        // Calculate owned state immediately with fetched data
        const isOwned = user.user_id === dto.user_id;
        setOwned(isOwned);

        // Load connection data in parallel
        const [
          followingCount,
          followersInstance,
          followingInstance,
          friendsInstance,
        ] = await Promise.all([
          getFollowingCount(dto.user_id),
          getFollowersInstanceByCreator(dto.user_id),
          getFollowingInstanceByUser(dto.user_id),
          getFriendsInstanceByUser(dto.user_id),
        ]);

        if (followingCount) setTotalFollowing(followingCount);
        if (followersInstance) setFollowerData(followersInstance);
        if (followingInstance) setFollowingData(followingInstance);
        if (friendsInstance) setFriendData(friendsInstance);

        await new Promise((resolve) => setTimeout(resolve, 500));
      } catch (error) {
        console.error("Failed to load profile:", error);
        showToast("Failed to load profile data");
        setProfileNotFound(true);
      } finally {
        setIsLoadingProfile(false);
      }
    };
    loadLoggedUser();
  }, [username, user]);

  useEffect(() => {
    const loadBoards = async () => {
      if (!creatorUserData || !user) return;

      try {
        const list = await getBoardByUser(
          creatorUserData.user_id,
          user.area_id
        );
        if (!list) return;

        const filtered = owned
          ? list
          : list.filter((b) => !b.visibilityPrivate);
        setBoards(filtered);
      } catch (error) {
        console.error("Failed to load boards:", error);
        showToast("Failed to load boards");
      }
    };
    loadBoards();
  }, [creatorUserData, owned, user]);

  useEffect(() => {
    const loadTabData = async () => {
      if (!creatorUserData || !activeTab) return;

      const {
        pinned_visibilityPrivate,
        liked_visibilityPrivate,
        content_visibilityPrivate,
        user_id,
      } = creatorUserData;

      setIsLoadingContent(true);

      try {
        if (activeTab === "content") {
          const data = owned
            ? await getByUserAll(user_id)
            : !content_visibilityPrivate
            ? await getByUser(user_id)
            : [];

          setContentItems(data || []);
        }

        // Liked tab
        if (activeTab === "liked") {
          if (owned || !liked_visibilityPrivate) {
            const data = await getLikedByUser(user_id);
            setLikedItems(data || []);
          }
        }

        // Pinned tab
        if (activeTab === "pinned") {
          if (owned || !pinned_visibilityPrivate) {
            const data = await getPinnedByUser(user_id);
            setSavedItems(data || []);
          }
        }

        // Board tabs
        if (activeTab.startsWith("board-")) {
          const boardId = Number(activeTab.replace("board-", ""));
          const data = await getContentByBoardId(
            boardId,
            creatorUserData.area_id
          );
          setBoardItems(data || []);
        }
      } catch (error) {
        console.error("Failed to load tab content:", error);
        showToast("Failed to load content");
      } finally {
        await new Promise((resolve) => setTimeout(resolve, 500));
        setIsLoadingContent(false);
      }
    };

    loadTabData();
  }, [activeTab, creatorUserData, owned]);

  const tabs = useMemo(() => {
    if (!creatorUserData) return [];
    const list = [];

    if (owned || !creatorUserData.content_visibilityPrivate)
      list.push({ id: "content", label: "Content", type: "content" });

    if (owned || !creatorUserData.liked_visibilityPrivate)
      list.push({ id: "liked", label: "Liked", type: "liked" });

    if (owned || !creatorUserData.pinned_visibilityPrivate)
      list.push({ id: "pinned", label: "Pinned", type: "saved" });

    boards.forEach((b) =>
      list.push({ id: `board-${b.board_id}`, label: b.title, type: "board" })
    );

    return list;
  }, [creatorUserData, boards, owned]);

  // Set initial active tab
  useEffect(() => {
    if (!activeTab && tabs.length > 0) {
      setActiveTab(tabs[0].id);
    }
  }, [tabs, activeTab]);

  const renderContentMasonry = (items: FullContentDto[]) => {
    const renderItem = (item: FullContentDto) => {
      if (item.post_type === "post")
        return <PostComponent key={item.content_id} post={item} />;
      return <ContentComponent key={item.content_id} content={item} />;
    };

    return (
      <div style={{ columnCount: 4, columnGap: "1rem" }}>
        {items.map((item) => (
          <div
            key={`${item.post_type}-${item.content_id}`}
            className="mb-4"
            style={{ breakInside: "avoid" }}
          >
            {renderItem(item)}
          </div>
        ))}
      </div>
    );
  };

  const renderActiveTab = () => {
    const active = tabs.find((t) => t.id === activeTab);
    if (!active) return null;

    if (active.type === "content") return renderContentMasonry(contentItems);
    if (active.type === "saved") return renderContentMasonry(savedItems);
    if (active.type === "liked") return renderContentMasonry(likedItems);

    if (active.type === "board") return renderContentMasonry(boardItems);

    return null;
  };

  return (
    <RootLayout>
      <div className="flex">
        <main className="ml-20 flex-1 min-h-screen bg-background">
          <div className="max-w-4xl mx-auto">
            <div className="pt-12 pb-8 px-8 border-b border-border/50">
              <div className="flex flex-col items-center gap-6 text-center">
                {isLoadingProfile ? (
                  <>
                    <Skeleton
                      circle
                      width={128}
                      height={128}
                      baseColor="#1f2937"
                      highlightColor="#374151"
                    />
                    <Skeleton
                      width={200}
                      height={32}
                      baseColor="#1f2937"
                      highlightColor="#374151"
                    />
                    <Skeleton
                      width={300}
                      height={20}
                      count={2}
                      baseColor="#1f2937"
                      highlightColor="#374151"
                    />
                    <div className="flex gap-8">
                      <Skeleton
                        width={80}
                        height={60}
                        baseColor="#1f2937"
                        highlightColor="#374151"
                      />
                      <Skeleton
                        width={80}
                        height={60}
                        baseColor="#1f2937"
                        highlightColor="#374151"
                      />
                      <Skeleton
                        width={80}
                        height={60}
                        baseColor="#1f2937"
                        highlightColor="#374151"
                      />
                      <Skeleton
                        width={80}
                        height={60}
                        baseColor="#1f2937"
                        highlightColor="#374151"
                      />
                    </div>
                    <Skeleton
                      width={200}
                      height={40}
                      baseColor="#1f2937"
                      highlightColor="#374151"
                    />
                  </>
                ) : profileNotFound || !creatorUserData ? (
                  <UserNotFoundPage />
                ) : creatorUserData ? (
                  <>
                    <img
                      src={creatorUserData.profile_picture}
                      alt="avatar"
                      className="w-32 h-32 rounded-full object-cover"
                    />
                    <div className="flex items-center gap-4 justify-center">
                      <h1 className="text-2xl font-bold">
                        {creatorUserData.username}
                      </h1>
                    </div>
                    <p className="text-sm text-foreground/60 max-w-md">
                      {creatorUserData.desc}
                    </p>
                    <div className="flex gap-8 text-sm justify-center">
                      <div>
                        <p className="text-lg font-bold">
                          {creatorUserData.total_reports}
                        </p>
                        <p className="text-muted-foreground">Reports</p>
                      </div>
                      <button
                        onClick={() => setShowConnectionModal(true)}
                        className="cursor-pointer hover:opacity-80 transition-opacity"
                      >
                        <p className="text-lg font-bold">
                          {creatorUserData.follower}
                        </p>
                        <p className="text-muted-foreground">Followers</p>
                      </button>
                      <button
                        onClick={() => setShowConnectionModal(true)}
                        className="cursor-pointer hover:opacity-80 transition-opacity"
                      >
                        <p className="text-lg font-bold">{totalFollowing}</p>
                        <p className="text-muted-foreground">Followings</p>
                      </button>
                      <div>
                        <p className="text-lg font-bold">
                          {creatorUserData.total_like}
                        </p>
                        <p className="text-muted-foreground">Likes</p>
                      </div>
                    </div>
                    <div className="flex gap-3 mt-4">
                      {!owned && (
                        <>
                          <Button
                            onClick={() => handleFollow(!isFollowed)}
                            variant="outline"
                          >
                            {isFollowed ? "Unfollow" : "Follow"}
                          </Button>
                          <Button onClick={handleSendMessage} variant="outline">
                            {"Send Message"}
                          </Button>
                        </>
                      )}
                      {owned && (
                        <Button onClick={goToSettings}>Edit Profile</Button>
                      )}
                      <Button onClick={handleShare} variant="outline">
                        Share
                      </Button>
                    </div>
                  </>
                ) : (
                  <UserNotFoundPage />
                )}
              </div>
            </div>

            <div className="flex justify-center border-b border-border/50 px-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
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

            <div className="px-8 py-12">
              {isLoadingContent ? (
                <div style={{ columnCount: 4, columnGap: "1rem" }}>
                  {Array.from({ length: 8 }).map((_, index) => (
                    <div
                      key={`skeleton-${index}`}
                      className="mb-4"
                      style={{ breakInside: "avoid" }}
                    >
                      <div className="bg-dark-800 border border-dark-700 rounded-lg p-4 min-h-[180px]">
                        <Skeleton
                          height={20}
                          width="75%"
                          baseColor="#1f2937"
                          highlightColor="#374151"
                          className="mb-2"
                        />
                        <Skeleton
                          count={2}
                          height={12}
                          baseColor="#1f2937"
                          highlightColor="#374151"
                          className="mb-4"
                        />
                        <div className="flex gap-4 items-center">
                          <Skeleton
                            circle
                            height={24}
                            width={24}
                            baseColor="#1f2937"
                            highlightColor="#374151"
                          />
                          <div className="flex gap-2 flex-1">
                            <Skeleton
                              height={12}
                              width={40}
                              baseColor="#1f2937"
                              highlightColor="#374151"
                            />
                            <Skeleton
                              height={12}
                              width={40}
                              baseColor="#1f2937"
                              highlightColor="#374151"
                            />
                            <Skeleton
                              height={12}
                              width={40}
                              baseColor="#1f2937"
                              highlightColor="#374151"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                renderActiveTab()
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Connection Modal */}
      <ConnectionModal
        isOpen={showConnectionModal}
        onClose={() => setShowConnectionModal(false)}
        followerData={followerData}
        followingData={followingData}
        friendData={friendData}
      />
    </RootLayout>
  );
}
