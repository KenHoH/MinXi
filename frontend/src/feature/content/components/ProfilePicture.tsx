import { useState } from "react";
import { X } from "lucide-react";

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

  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16",
  };

  return (
    <>
      <img
        src={`/api/placeholder?size=48&text=@creator${creator_id}`}
        alt={`Creator ${creator_id}`}
        className={`${sizeClasses[size]} rounded-full ${
          clickable ? "cursor-pointer hover:opacity-80 transition-opacity" : ""
        }`}
        onClick={() => clickable && setShowProfileModal(true)}
      />

      {/* Profile Modal */}
      {showProfileModal && (
        <ProfileModal
          creator_id={creator_id}
          onClose={() => setShowProfileModal(false)}
        />
      )}
    </>
  );
}

interface ProfileModalProps {
  creator_id: number;
  onClose: () => void;
}

function ProfileModal({ creator_id, onClose }: ProfileModalProps) {
  const [followed, setFollowed] = useState(false);

  const handleClickOutside = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement)?.id === "profile-modal-backdrop") {
      onClose();
    }
  };

  return (
    <div
      id="profile-modal-backdrop"
      onClick={handleClickOutside}
      className="fixed inset-0 bg-black flex items-center justify-center z-50 p-4"
    >
      <div className="bg-dark-800 rounded-lg w-full max-w-md overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-black/50 rounded-full hover:bg-black/70 text-white transition-colors z-10"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Cover Image */}
        <div className="h-32 bg-gradient-to-r from-burgundy-600 to-burgundy-800"></div>

        {/* Profile Content */}
        <div className="px-6 pb-6">
          {/* Profile Picture */}
          <div className="flex flex-col items-center -mt-16 mb-4">
            <img
              src={`/api/placeholder?size=128&text=@creator${creator_id}`}
              alt={`Creator ${creator_id}`}
              className="w-32 h-32 rounded-full border-4 border-dark-800"
            />
          </div>

          {/* User Info */}
          <div className="text-center space-y-2 mb-6">
            <h2 className="text-xl font-bold text-white">
              @creator{creator_id}
            </h2>
            <p className="text-sm text-gray-400">Creative Content Creator</p>
            <p className="text-xs text-gray-500">
              Joined 6 months ago · 1.2K followers
            </p>
          </div>

          {/* Bio */}
          <p className="text-sm text-gray-300 text-center mb-6">
            Passionate about creating amazing content. Follow for more!
          </p>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="text-center">
              <p className="text-lg font-bold text-white">245</p>
              <p className="text-xs text-gray-400">Posts</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-white">1.2K</p>
              <p className="text-xs text-gray-400">Followers</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-white">342</p>
              <p className="text-xs text-gray-400">Following</p>
            </div>
          </div>

          {/* Follow Button */}
          <button
            onClick={() => setFollowed(!followed)}
            className={`w-full px-4 py-2 rounded-lg font-medium transition-all ${
              followed
                ? "bg-dark-700 text-gray-300 hover:bg-dark-600"
                : "bg-burgundy-600 text-white hover:bg-burgundy-700"
            }`}
          >
            {followed ? "Following" : "Follow"}
          </button>
        </div>
      </div>
    </div>
  );
}
