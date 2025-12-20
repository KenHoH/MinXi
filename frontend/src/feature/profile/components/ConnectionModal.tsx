import { useState } from "react";
import { X } from "lucide-react";
import type { UserDto } from "@/service/api";

interface ConnectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  followerData: UserDto[];
  followingData: UserDto[];
  friendData: UserDto[];
}

export function ConnectionModal({
  isOpen,
  onClose,
  followerData,
  followingData,
  friendData,
}: ConnectionModalProps) {
  const [activeTab, setActiveTab] = useState<
    "followers" | "following" | "friends"
  >("followers");

  const getTabData = () => {
    switch (activeTab) {
      case "followers":
        return followerData;
      case "following":
        return followingData;
      case "friends":
        return friendData;
      default:
        return [];
    }
  };

  const tabData = getTabData();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-background rounded-lg shadow-lg max-w-2xl w-full max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border/50">
          <h2 className="text-2xl font-bold">Connections</h2>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-border/50 px-6">
          <button
            onClick={() => setActiveTab("followers")}
            className={`px-4 py-3 font-medium text-sm border-b-2 transition-colors ${
              activeTab === "followers"
                ? "border-primary text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            Followers ({followerData.length})
          </button>
          <button
            onClick={() => setActiveTab("following")}
            className={`px-4 py-3 font-medium text-sm border-b-2 transition-colors ${
              activeTab === "following"
                ? "border-primary text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            Following ({followingData.length})
          </button>
          <button
            onClick={() => setActiveTab("friends")}
            className={`px-4 py-3 font-medium text-sm border-b-2 transition-colors ${
              activeTab === "friends"
                ? "border-primary text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            Friends ({friendData.length})
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {tabData.length === 0 ? (
            <div className="flex items-center justify-center h-32 text-muted-foreground">
              No {activeTab} yet
            </div>
          ) : (
            <div className="space-y-4">
              {tabData.map((userData) => (
                <div
                  key={userData.user_id}
                  className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border border-border/50 hover:border-border transition-colors"
                >
                  <div className="flex items-center gap-4 flex-1">
                    {/* Profile Picture */}
                    <img
                      src={userData.profile_picture}
                      alt={userData.username}
                      className="w-12 h-12 rounded-full object-cover"
                    />

                    {/* User Info */}
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground">
                        {userData.username}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {userData.follower < 0 ? 0 : userData.follower}{" "}
                        followers
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
