import type { UserDto } from "@/service/api";
import { useState } from "react";

interface ProfilePictureProps {
  creator: UserDto | null;
  size?: "sm" | "md" | "lg";
  clickable?: boolean;
}

export function ProfilePicture({
  creator,
  size = "md",
  clickable = true,
}: ProfilePictureProps) {
  const [showProfileModal, setShowProfileModal] = useState(false);

  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16",
  };

  return (
    <>
      <img
        src={
          creator?.profile_picture ||
          "http://localhost:3000/uploads/profile/1763906830326-69740177.png"
        }
        alt={`Creator ${creator?.user_id}`}
        className={`${sizeClasses[size]} rounded-full ${
          clickable ? "cursor-pointer hover:opacity-80 transition-opacity" : ""
        }`}
        onClick={() => clickable && setShowProfileModal(true)}
      />

      {/* Profile Modal */}
      {/* {showProfileModal && (
        <ProfileModal
          creator_id={creator_id}
          onClose={() => setShowProfileModal(false)}
        />
      )} */}
    </>
  );
}
