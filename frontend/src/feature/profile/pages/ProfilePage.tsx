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
import useNotification from "@/shared/logic/useNotificatoin";
import useSocialService from "@/shared/hooks/useSocialService";

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

  // const [loggedUserData, setLoggedUserData] = useState<UserDto | null>(null);
  const [creatorUserData, setCreatorUserData] = useState<UserDto | null>(null);
  const [followerData, setFollowerData] = useState<UserDto[]>([]);
  const [followingData, setFollowingData] = useState<UserDto[]>([]);
  const [friendData, setFriendData] = useState<UserDto[]>([]);
  const [totalFollowing, setTotalFollowing] = useState(0);
  const [owned, setOwned] = useState(false);

  const [contentItems, setContentItems] = useState<FullContentDto[] | []>([]);
  const [savedItems, setSavedItems] = useState<FullContentDto[] | []>([]);
  const [likedItems, setLikedItems] = useState<FullContentDto[] | []>([]);
  const [boards, setBoards] = useState<BoardDto[] | []>([]);
  const [boardItems, setBoardItems] = useState<FullContentDto[] | []>([]);
  const [showConnectionModal, setShowConnectionModal] = useState(false);
  const [followed, setFollowed] = useState(false);
  const { checkFollow, createFollow, deleteFollow } = useConnectionService();
  const { updateFollowUser } = useUserService();
  const { sendNotificatonSystem } = useNotification();
  const { createRoom } = useSocialService();

  useEffect(() => {
    const checkFollowStatus = async () => {
      if (!user || owned) {
        setFollowed(false);
        return;
      }
      if (!creatorUserData) {
        setFollowed(false);
        return;
      }

      try {
        const isFollowing = await checkFollow(
          creatorUserData.user_id,
          user.user_id
        );
        setFollowed(isFollowing || false);
      } catch (error) {
        console.error("Failed to check follow status:", error);
        setFollowed(false);
      }
    };

    checkFollowStatus();
  }, [user, creatorUserData, owned]);
  const handleFollow = async (delta: boolean) => {
    if (!user) return;
    if (!creatorUserData) return;
    setFollowed(!delta);
    if (delta == false) {
      await createFollow(creatorUserData.user_id, user.user_id);
      await updateFollowUser(creatorUserData.user_id, { delta: 1 });
      sendNotificatonSystem(
        creatorUserData.user_id,
        user.user_id,
        `${creatorUserData.username} started following you!`,
        "New Follower",
        "FOLLOW"
      );
    } else {
      await deleteFollow(creatorUserData.user_id, user.user_id);
      await updateFollowUser(creatorUserData.user_id, { delta: -1 });
    }
  };

  const goToSettings = () => {
    if (!creatorUserData) return;
    navigate(`/settings/${creatorUserData.username}`);
  };

  const [activeTab, setActiveTab] = useState("");
  const handleShare = async () => {
    if (!creatorUserData) return;
    const link = `profile/${creatorUserData.username}`;

    try {
      await navigator.clipboard.writeText(link);
      showToast("Link copied to clipboard!");
    } catch (err) {
      showToast("Failed to copy link");
    }
  };
  const handleMessage = async () => {
    if (!creatorUserData || !user) return;
    if (owned) return;

    await createRoom({
      members: [user.user_id, creatorUserData.user_id],
      room_type: "DIRECT",
    });

    navigate(`/chat`);
  };

  useEffect(() => {
    const loadCreator = async () => {
      if (!creatorUserData) return;

      const followingCount = await getFollowingCount(creatorUserData.user_id);
      if (followingCount) setTotalFollowing(followingCount);

      const followersInstance = await getFollowersInstanceByCreator(
        creatorUserData.user_id
      );
      if (followersInstance) setFollowerData(followersInstance);

      const followingInstance = await getFollowingInstanceByUser(
        creatorUserData.user_id
      );
      if (followingInstance) setFollowingData(followingInstance);
      const friendsInstance = await getFriendsInstanceByUser(
        creatorUserData.user_id
      );
      if (friendsInstance) setFriendData(friendsInstance);
    };
    loadCreator();
  }, [creatorUserData]);
  useEffect(() => {
    const loadCreatorUser = async () => {
      if (!username) return;
      if (!user) return;
      const found = await findOneByUsername(username, user.area_id);
      if (!found) return;

      if (found) setCreatorUserData(found);
    };
    loadCreatorUser();
  }, [username, user?.area_id]);

  useEffect(() => {
    if (user && creatorUserData) {
      setOwned(user.user_id === creatorUserData.user_id);
    }
  }, [user, creatorUserData]);

  useEffect(() => {
    const loadBoards = async () => {
      if (!creatorUserData || !user) return;
      const list = await getBoardByUser(creatorUserData.user_id, user.area_id);
      if (!list) return;

      const filtered = owned ? list : list.filter((b) => !b.visibilityPrivate);
      setBoards(filtered);
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

      // Content tab
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
    };

    loadTabData();
  }, [activeTab, creatorUserData, owned]);

  useEffect(() => {
    const loadBoardItems = async () => {
      if (!activeTab || !activeTab.startsWith("board-")) return;
      if (!creatorUserData) return;

      const boardId = Number(activeTab.replace("board-", ""));
      const contents = await getContentByBoardId(
        boardId,
        creatorUserData.area_id
      );
      setBoardItems(contents || []);
    };
    loadBoardItems();
  }, [activeTab, creatorUserData]);

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

    if (!activeTab && list.length > 0) setActiveTab(list[0].id);

    return list;
  }, [creatorUserData, boards]);

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
                {creatorUserData ? (
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
                      <Button onClick={handleShare} variant="outline">
                        Share
                      </Button>
                      {!owned && (
                        <Button onClick={handleMessage} variant="outline">
                          Message
                        </Button>
                      )}
                      <Button
                        onClick={() => handleFollow(followed)}
                        disabled={owned}
                      >
                        {owned
                          ? "Following"
                          : followed
                          ? "Following"
                          : "Follow"}
                      </Button>
                      {owned && (
                        <Button onClick={goToSettings}>Edit Profile</Button>
                      )}
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

            <div className="px-8 py-12">{renderActiveTab()}</div>
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
