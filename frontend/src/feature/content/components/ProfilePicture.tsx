import { useNavigate } from "react-router";
import type { UserProfile } from "./models/UserProfile";

interface ProfilePictureProps {
  creator: UserProfile;
  size?: "sm" | "md" | "lg";
  clickable?: boolean;
}

export function ProfilePicture({
  creator,
  size = "md",
  clickable = true,
}: ProfilePictureProps) {
  const navigate = useNavigate();
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16",
  };

  return (
    <>
      <img
        src={
          creator?.profile_picture_url ||
          "http://localhost:3000/uploads/profile/1763906830326-69740177.png"
        }
        alt={`Creator ${creator?.username}`}
        className={`${sizeClasses[size]} rounded-full ${
          clickable ? "cursor-pointer hover:opacity-80 transition-opacity" : ""
        }`}
        onClick={() =>
          clickable && navigate(`/profile/${creator?.username ?? ""}`)
        }
      />
    </>
  );
}
