"use client";

import { useState, useEffect } from "react";
import { X, Plus, Trash2, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import type {
  MessageResponseDto,
  RoomResponseDto,
  UserDto,
  UserRoleDto,
} from "@/service/api";
import useSocialService from "@/shared/hooks/useSocialService";
import useConnectionService from "@/shared/hooks/useConnectionService";

interface ChatHeaderPopoverProps {
  isOpen: boolean;
  onClose: () => void;
  room: RoomResponseDto;
  currentUserRole?: string;
  members: UserRoleDto[];
  mediaUrls: MessageResponseDto[];
  currentUser: number;
}

type TabType = "overview" | "members" | "media";

export default function ChatHeaderPopover({
  isOpen,
  onClose,
  room,
  currentUserRole,
  members,
  mediaUrls,
  currentUser,
}: ChatHeaderPopoverProps) {
  const [activeTab, setActiveTab] = useState<TabType>("overview");
  const [selectedMedia, setSelectedMedia] = useState<MessageResponseDto | null>(
    null
  );
  const [memberList, setMemberList] = useState<UserRoleDto[]>(members);
  const [showAddMemberMode, setShowAddMemberMode] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const { getFriendsInstanceByUser } = useConnectionService();

  const [friends, setFriends] = useState<UserDto[]>([]);

  const { removeUserFromRoom, deleteRoom, addUserToRoom } = useSocialService();
  const removeUser = async (userId: number) => {
    if (userId === 0) return;
    await removeUserFromRoom({
      roomId: room.id,
      userId: userId,
    });
    // Filter out the removed member from the list
    setMemberList((prevMembers) =>
      prevMembers.filter((m) => m.user_id !== userId)
    );
  };

  const addMember = async (userId: number) => {
    await addUserToRoom({
      roomId: room.id,
      userId: userId,
      role: "MEMBER",
    });
    setFriends((prevFriends) =>
      prevFriends.filter((f) => f.user_id !== userId)
    );
  };

  const deleteThisRoom = async () => {
    await deleteRoom(room.id);
    setShowDeleteConfirm(false);
    onClose();
  };

  // Sync memberList with members prop when it changes
  useEffect(() => {
    setMemberList(members);
  }, [members]);

  useEffect(() => {
    const fetchFriends = async () => {
      const friendsInstance = await getFriendsInstanceByUser(currentUser);
      if (friendsInstance) setFriends(friendsInstance);
    };
    fetchFriends();
  }, [currentUser]);

  if (!isOpen) return null;

  const isMember = currentUserRole === "MEMBER";
  const isAdminOrOwner =
    currentUserRole === "ADMIN" || currentUserRole === "OWNER";
  const isOwner = currentUserRole === "OWNER";

  return (
    <div className="fixed inset-0 z-50" onClick={onClose}>
      {/* Popover container */}
      <div
        className="absolute top-16 right-4 w-96 bg-background border border-border rounded-lg shadow-lg max-h-[80vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="text-lg font-semibold text-foreground">{room.name}</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-muted rounded transition-colors"
          >
            <X className="w-5 h-5 text-foreground" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 px-4 pt-4 border-b border-border">
          <button
            onClick={() => setActiveTab("overview")}
            className={`px-3 py-2 text-sm font-medium rounded-t transition-colors ${
              activeTab === "overview"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Overview
          </button>
          {room.type !== "DIRECT" && (
            <button
              onClick={() => setActiveTab("members")}
              className={`px-3 py-2 text-sm font-medium rounded-t transition-colors ${
                activeTab === "members"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Members
            </button>
          )}
          <button
            onClick={() => setActiveTab("media")}
            className={`px-3 py-2 text-sm font-medium rounded-t transition-colors ${
              activeTab === "media"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Media
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {/* Overview Tab */}
          {activeTab === "overview" && (
            <div className="space-y-4">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Type</p>
                <p className="text-sm font-medium text-foreground capitalize">
                  {room.type}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Created</p>
                <p className="text-sm font-medium text-foreground">
                  {new Date(room.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">
                  Description
                </p>
                <p className="text-sm text-foreground">
                  No description available
                </p>
              </div>
              <div className="pt-4 space-y-2">
                {!isMember && room.type !== "DIRECT" && (
                  <Button
                    variant="destructive"
                    className="w-full"
                    onClick={() => {
                      setShowDeleteConfirm(true);
                    }}
                  >
                    {isOwner ? "Delete Group" : "Exit Group"}
                  </Button>
                )}
                {isMember && room.type !== "DIRECT" && (
                  <Button
                    variant="destructive"
                    className="w-full"
                    onClick={() => {
                      // Handle exit group
                      removeUser(currentUser);
                      alert("You have exited the group." + currentUser);
                      onClose();
                    }}
                  >
                    Exit Group
                  </Button>
                )}
              </div>
            </div>
          )}

          {/* Members Tab */}
          {activeTab === "members" && (
            <div className="space-y-4">
              {isAdminOrOwner && (
                <Button
                  variant="outline"
                  className="w-full gap-2"
                  onClick={() => {
                    setShowAddMemberMode(!showAddMemberMode);
                  }}
                >
                  <Plus className="w-4 h-4" />
                  {showAddMemberMode ? "Done" : "Add Member"}
                </Button>
              )}

              {/* Add Member Mode */}
              {showAddMemberMode && (
                <div className="space-y-2 max-h-96 overflow-y-auto border border-border rounded-lg p-3 bg-muted/30">
                  <p className="text-xs text-muted-foreground font-medium mb-2">
                    Select friends to add
                  </p>
                  {friends.length > 0 ? (
                    friends.map((friend) => (
                      <div
                        key={friend.user_id}
                        className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                      >
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <img
                            src={friend.profile_picture || ""}
                            alt={friend.username}
                            className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                          />
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium text-foreground truncate">
                              {friend.username}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => addMember(friend.user_id)}
                          className="p-1 hover:bg-primary/20 rounded transition-colors ml-2 flex-shrink-0"
                        >
                          <Plus className="w-4 h-4 text-primary" />
                        </button>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      No friends available to add
                    </p>
                  )}
                </div>
              )}

              {/* Members List */}
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {memberList.length > 0 ? (
                  memberList.map((member) => (
                    <div
                      key={member.user_id}
                      className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <img
                          src={member.profile_picture || ""}
                          alt={member.username}
                          className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-foreground truncate">
                            {member.username}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {member.role}
                          </p>
                        </div>
                      </div>
                      {isOwner && (
                        <button
                          onClick={() => {
                            // Handle remove member
                            removeUser(member.user_id);
                          }}
                          className="p-1 hover:bg-destructive/20 rounded transition-colors ml-2 flex-shrink-0"
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </button>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No members found
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Media Tab */}
          {activeTab === "media" && (
            <div>
              {mediaUrls.length > 0 ? (
                <div className="grid grid-cols-3 gap-2">
                  {mediaUrls.map((media, index) => {
                    const isImage = media.type === "IMAGE";
                    const isVideo = media.type === "VIDEO";

                    return (
                      <div
                        key={index}
                        className="relative aspect-square rounded-lg overflow-hidden bg-muted hover:opacity-80 transition-opacity cursor-pointer group"
                        onClick={() => setSelectedMedia(media)}
                      >
                        {isImage && (
                          <img
                            src={media.mediaUrl || ""}
                            alt={`Media ${index + 1}`}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.style.display = "none";
                            }}
                          />
                        )}
                        {isVideo && (
                          <>
                            <video
                              src={media.mediaUrl || ""}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.currentTarget.style.display = "none";
                              }}
                            />
                            <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/50 transition-colors">
                              <Play className="w-8 h-8 text-white fill-white" />
                            </div>
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-8">
                  No media shared yet
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Media Preview Modal */}
      {selectedMedia && (
        <div
          className="fixed inset-0 z-[60] bg-black/80 flex items-center justify-center p-4"
          onClick={() => setSelectedMedia(null)}
        >
          <div
            className="relative max-w-2xl max-h-[90vh] w-full h-full flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedMedia(null)}
              className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full transition-colors z-10"
            >
              <X className="w-6 h-6 text-white" />
            </button>

            {/* Content */}
            {selectedMedia.type === "IMAGE" && (
              <img
                src={selectedMedia.mediaUrl || ""}
                alt="Full media"
                className="max-w-full max-h-full object-contain rounded-lg"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            )}
            {selectedMedia.type === "VIDEO" && (
              <video
                src={selectedMedia.mediaUrl || ""}
                controls
                autoPlay
                className="max-w-full max-h-full rounded-lg"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            )}
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {showDeleteConfirm && (
        <div
          className="fixed inset-0 z-[60] bg-black/50 flex items-center justify-center p-4"
          onClick={() => setShowDeleteConfirm(false)}
        >
          <div
            className="bg-background border border-border rounded-lg shadow-lg p-6 max-w-sm w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Delete {room.type === "GROUP" ? "Group" : "Room"}?
            </h3>
            <p className="text-sm text-muted-foreground mb-6">
              Are you sure you want to delete this{" "}
              {room.type === "GROUP" ? "group" : "room"}? This action cannot be
              undone.
            </p>
            <div className="flex gap-3 justify-end">
              <Button
                variant="outline"
                onClick={() => setShowDeleteConfirm(false)}
              >
                Cancel
              </Button>
              <Button variant="destructive" onClick={() => deleteThisRoom()}>
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
