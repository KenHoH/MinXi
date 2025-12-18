"use client";

import { useEffect, useState } from "react";
import { X, Plus, UserPlus, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { RoomResponseDto } from "@/service/api";
import useSocialService from "@/shared/hooks/useSocialService";
import { useAuthContext } from "@/feature/auth/context/AuthContext";

interface CommunityModalProps {
  isOpen: boolean;
  community: RoomResponseDto | null;
  onClose: () => void;
}

export default function CommunityModal({
  isOpen,
  community,
  onClose,
}: CommunityModalProps) {
  const [communityGroups, setCommunityGroups] = useState<RoomResponseDto[]>([]);
  const [availableGroups, setAvailableGroups] = useState<RoomResponseDto[]>([]);
  const [userJoinedGroups, setUserJoinedGroups] = useState<Set<string>>(
    new Set()
  );
  const [showAddGroup, setShowAddGroup] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [joiningGroupId, setJoiningGroupId] = useState<string | null>(null);
  const { user } = useAuthContext();
  const {
    getGroupFromCommunity,
    getRoomGroupJoinedByUserId,
    addGroupToCommunity,
    addUserToRoom,
  } = useSocialService();

  useEffect(() => {
    if (isOpen && community) {
      fetchCommunityGroups();
      fetchAvailableGroups();
    }
  }, [isOpen, community]);

  const fetchCommunityGroups = async () => {
    if (!community) return;
    setIsLoading(true);
    try {
      const groups = await getGroupFromCommunity(community.id);
      if (groups) {
        setCommunityGroups(groups);
      }
    } catch (error) {
      console.error("Failed to fetch community groups:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAvailableGroups = async () => {
    if (!user) return;
    try {
      const userGroups = await getRoomGroupJoinedByUserId(user.user_id);
      if (userGroups) {
        setAvailableGroups(userGroups);
        // Track which groups the user has joined
        const joinedGroupIds = new Set(userGroups.map((g) => g.id));
        setUserJoinedGroups(joinedGroupIds);
      }
    } catch (error) {
      console.error("Failed to fetch user groups:", error);
    }
  };

  const handleAddGroup = async (groupId: string) => {
    if (!community) return;
    setIsLoading(true);
    try {
      await addGroupToCommunity({
        communitiesId: community.id,
        groupId: groupId,
      });
      // Refresh the groups list
      await fetchCommunityGroups();
      setShowAddGroup(false);
    } catch (error) {
      console.error("Failed to add group to community:", error);
      alert("Failed to add group to community. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleJoinGroup = async (groupId: string) => {
    if (!user) return;
    setJoiningGroupId(groupId);
    try {
      await addUserToRoom({
        roomId: groupId,
        userId: user.user_id,
      });
      // Update the joined groups set
      setUserJoinedGroups((prev) => new Set(prev).add(groupId));
      // Refresh available groups
      await fetchAvailableGroups();
    } catch (error) {
      console.error("Failed to join group:", error);
      alert("Failed to join group. Please try again.");
    } finally {
      setJoiningGroupId(null);
    }
  };

  if (!isOpen || !community) return null;

  // Filter out groups that are already in the community
  const groupsToAdd = availableGroups.filter(
    (group) => !communityGroups.some((cg) => cg.id === group.id)
  );

  return (
    <div className="fixed inset-0 z-50" onClick={onClose}>
      <div
        className="absolute inset-0 bg-black/50 flex items-center justify-center p-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="bg-background border border-border rounded-lg shadow-lg w-full max-w-md max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border sticky top-0 bg-background">
            <div className="flex items-center gap-3">
              <img
                src={community.pictureUrl}
                alt={community.name}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <h2 className="text-lg font-semibold text-foreground">
                  {community.name}
                </h2>
                <p className="text-xs text-muted-foreground">
                  Community · {communityGroups.length} Group
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1 hover:bg-muted rounded transition-colors"
            >
              <X className="w-5 h-5 text-foreground" />
            </button>
          </div>

          {/* Content */}
          <div className="p-4">
            {/* Groups Section Header */}
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-foreground">Grup</h3>
              {!showAddGroup && groupsToAdd.length > 0 && (
                <button
                  onClick={() => setShowAddGroup(true)}
                  className="text-xs text-primary hover:text-primary/80 font-medium transition-colors"
                >
                  + add group
                </button>
              )}
            </div>

            {/* Show Add Group Section */}
            {showAddGroup && (
              <div className="mb-4 p-3 border border-border rounded-lg bg-muted/20">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-medium text-foreground">
                    Select groups to add
                  </p>
                  <button
                    onClick={() => setShowAddGroup(false)}
                    className="text-xs text-muted-foreground hover:text-foreground"
                  >
                    Cancel
                  </button>
                </div>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {groupsToAdd.length > 0 ? (
                    groupsToAdd.map((group) => (
                      <div
                        key={group.id}
                        className="flex items-center justify-between p-2 hover:bg-muted/50 rounded-lg transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <img
                            src={group.pictureUrl}
                            alt={group.name}
                            className="w-8 h-8 rounded-full object-cover"
                          />
                          <p className="text-sm font-medium text-foreground">
                            {group.name}
                          </p>
                        </div>
                        <button
                          onClick={() => handleAddGroup(group.id)}
                          disabled={isLoading}
                          className="p-1.5 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-colors disabled:opacity-50"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-muted-foreground text-center py-4">
                      There's no more groups to add.
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Groups List */}
            <div className="space-y-2">
              {isLoading && communityGroups.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
                </div>
              ) : communityGroups.length > 0 ? (
                communityGroups.map((group) => {
                  const isJoined = userJoinedGroups.has(group.id);
                  const isJoining = joiningGroupId === group.id;

                  return (
                    <div
                      key={group.id}
                      className="flex items-center gap-3 p-3 hover:bg-muted/50 rounded-lg transition-colors"
                    >
                      <img
                        src={group.pictureUrl}
                        alt={group.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-foreground">
                          {group.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {isJoined ? "Joined" : "Not joined"}
                        </p>
                      </div>
                      {isJoined ? (
                        <div className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
                          <Check className="w-4 h-4" />
                          <span>Joined</span>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleJoinGroup(group.id)}
                          disabled={isJoining}
                          className="px-3 py-1.5 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center gap-1 text-xs font-medium"
                        >
                          {isJoining ? (
                            <>
                              <div className="w-3 h-3 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                              <span>Joining...</span>
                            </>
                          ) : (
                            <>
                              <UserPlus className="w-3 h-3" />
                              <span>Join</span>
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-8">
                  <p className="text-sm text-muted-foreground mb-4">
                    Groups added to the community will be displayed here.
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Community members can join these groups.
                  </p>
                </div>
              )}
            </div>

            {/* Add Group Button at Bottom */}
            {!showAddGroup && groupsToAdd.length > 0 && (
              <div className="mt-4 pt-4 border-t border-border">
                <Button
                  onClick={() => setShowAddGroup(true)}
                  className="w-full"
                  variant="outline"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Group
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
