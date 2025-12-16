"use client";

import { useState } from "react";
import { X, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { UserDto } from "@/service/api";
import useSocialService from "@/shared/hooks/useSocialService";
import useConnectionService from "@/shared/hooks/useConnectionService";
import { useAuthContext } from "@/feature/auth/context/AuthContext";

interface CreateRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRoomCreated?: () => void;
}

type Step = "type-select" | "details" | "members-select";

export default function CreateRoomModal({
  isOpen,
  onClose,
  onRoomCreated,
}: CreateRoomModalProps) {
  const [step, setStep] = useState<Step>("type-select");
  const [roomType, setRoomType] = useState<"GROUP" | "COMMUNITY" | null>(null);
  const [roomName, setRoomName] = useState("");
  const [thumbnail, setThumbnail] = useState<Blob | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState("");
  const [selectedMembers, setSelectedMembers] = useState<number[]>([]);
  const [friends, setFriends] = useState<UserDto[]>([]);
  const [isCreating, setIsCreating] = useState(false);

  const { createRoom } = useSocialService();
  const { getFriendsInstanceByUser } = useConnectionService();
  const { user } = useAuthContext();

  if (!isOpen) return null;

  const handleTypeSelect = async (type: "GROUP" | "COMMUNITY") => {
    setRoomType(type);
    setStep("details");

    // Fetch friends for later
    if (user) {
      const friendsInstance = await getFriendsInstanceByUser(user.user_id);
      if (friendsInstance) {
        setFriends(friendsInstance);
      }
    }
  };

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setThumbnail(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        setThumbnailPreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleMemberToggle = (userId: number) => {
    setSelectedMembers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const handleCreateRoom = async () => {
    if (!roomName.trim() || selectedMembers.length === 0 || !user) {
      alert("Please enter a room name and select at least one member");
      return;
    }

    setIsCreating(true);
    try {
      await createRoom({
        name_room: roomName,
        room_type: roomType || "GROUP",
        members: selectedMembers,
        owner_id: user.user_id,
        thumbnail: thumbnail || undefined,
      });

      // Reset and close
      setRoomName("");
      setThumbnail(null);
      setThumbnailPreview("");
      setSelectedMembers([]);
      setRoomType(null);
      setStep("type-select");
      onRoomCreated?.();
      onClose();
    } catch (error) {
      console.error("Failed to create room:", error);
      alert("Failed to create room. Please try again.");
    } finally {
      setIsCreating(false);
    }
  };

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
            <h2 className="text-lg font-semibold text-foreground">
              {step === "type-select" && "Create New Room"}
              {step === "details" && `Create ${roomType}`}
              {step === "members-select" && "Select Members"}
            </h2>
            <button
              onClick={onClose}
              className="p-1 hover:bg-muted rounded transition-colors"
            >
              <X className="w-5 h-5 text-foreground" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Step 1: Type Selection */}
            {step === "type-select" && (
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground mb-4">
                  Choose what type of room you want to create
                </p>
                <button
                  onClick={() => handleTypeSelect("GROUP")}
                  className="w-full p-4 border border-border rounded-lg hover:bg-muted transition-colors text-left"
                >
                  <p className="font-medium text-foreground mb-1">
                    Create a Group
                  </p>
                  <p className="text-xs text-muted-foreground">
                    A private group with selected friends
                  </p>
                </button>
                <button
                  onClick={() => handleTypeSelect("COMMUNITY")}
                  className="w-full p-4 border border-border rounded-lg hover:bg-muted transition-colors text-left"
                >
                  <p className="font-medium text-foreground mb-1">
                    Create a Community
                  </p>
                  <p className="text-xs text-muted-foreground">
                    A community where anyone can join
                  </p>
                </button>
              </div>
            )}

            {/* Step 2: Details (Name & Thumbnail) */}
            {step === "details" && (
              <div className="space-y-4">
                {/* Room Name */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    {roomType} Name *
                  </label>
                  <input
                    type="text"
                    value={roomName}
                    onChange={(e) => setRoomName(e.target.value)}
                    placeholder={`Enter ${roomType?.toLowerCase()} name`}
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                {/* Thumbnail Upload */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Profile Picture (Optional)
                  </label>
                  <div className="relative">
                    {thumbnailPreview ? (
                      <div className="relative w-full h-40 rounded-lg overflow-hidden border border-border">
                        <img
                          src={thumbnailPreview}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                        <button
                          onClick={() => {
                            setThumbnail(null);
                            setThumbnailPreview("");
                          }}
                          className="absolute top-2 right-2 p-1 bg-destructive/20 hover:bg-destructive/30 rounded transition-colors"
                        >
                          <X className="w-4 h-4 text-destructive" />
                        </button>
                      </div>
                    ) : (
                      <label className="flex items-center justify-center w-full h-40 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-primary hover:bg-muted/50 transition-colors">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <Upload className="w-8 h-8 text-muted-foreground mb-2" />
                          <p className="text-sm text-muted-foreground">
                            Click to upload image
                          </p>
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleThumbnailChange}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => setStep("type-select")}
                  >
                    Back
                  </Button>
                  <Button
                    className="flex-1"
                    onClick={() => setStep("members-select")}
                    disabled={!roomName.trim()}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}

            {/* Step 3: Members Selection */}
            {step === "members-select" && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Select Members * (Minimum 1 required)
                  </label>
                  <p className="text-xs text-muted-foreground mb-3">
                    Selected: {selectedMembers.length}
                  </p>

                  <div className="space-y-2 max-h-64 overflow-y-auto border border-border rounded-lg p-3 bg-muted/30">
                    {friends.length > 0 ? (
                      friends.map((friend) => (
                        <label
                          key={friend.user_id}
                          className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                        >
                          <input
                            type="checkbox"
                            checked={selectedMembers.includes(friend.user_id)}
                            onChange={() => handleMemberToggle(friend.user_id)}
                            className="w-4 h-4 rounded border-border"
                          />
                          <img
                            src={friend.profile_picture || ""}
                            alt={friend.username}
                            className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-foreground truncate">
                              {friend.username}
                            </p>
                          </div>
                        </label>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground text-center py-4">
                        No friends available
                      </p>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => setStep("details")}
                    disabled={isCreating}
                  >
                    Back
                  </Button>
                  <Button
                    className="flex-1"
                    onClick={handleCreateRoom}
                    disabled={selectedMembers.length === 0 || isCreating}
                  >
                    {isCreating ? "Creating..." : "Create Room"}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
