import { useEffect, useState, useRef } from "react";
import useUserService from "@/shared/hooks/useUserService";
import type { CredentialRes, UserDto } from "@/service/api";

interface ProfilePictureProps {
  creator_id: number;
  size?: "sm" | "md" | "lg";
  clickable?: boolean;
}

export function ProfilePicture({
  creator_id,
  size = "md",
  clickable = true,
}: ProfilePictureProps) {
  const [showProfileModal, setShowProfileModal] = useState(false);
  const { findUserById } = useUserService();
  const lastFetchedIdRef = useRef<number | null>(null);
  const [userData, setUserData] = useState<UserDto | null>(null);

  useEffect(() => {
    if (lastFetchedIdRef.current === creator_id) {
      return;
    }

    async function fetchUser() {
      try {
        lastFetchedIdRef.current = creator_id;
        const user = await findUserById(creator_id);
        setUserData(user);
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      }
    }
    fetchUser();
  }, [creator_id, findUserById]);

  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16",
  };

  return (
    <>
      <img
        src={
          userData?.profile_picture ||
          "http://localhost:3000/uploads/profile/1763906830326-69740177.png"
        }
        alt={`Creator ${creator_id}`}
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
