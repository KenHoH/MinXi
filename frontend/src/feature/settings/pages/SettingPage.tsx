"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import RootLayout from "@/app/LayoutPage";
import useUserService from "@/shared/hooks/useUserService";
import { useAuthContext } from "@/feature/auth/context/AuthContext";
import { useToast } from "@/shared/context/ToastContext";

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    privateContent: false,
    privatePinned: false,
    privateLiked: false,
    likeDisable: false,
    commentDisable: false,
    followDisable: false,
  });
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [profileImagePreview, setProfileImagePreview] = useState<string>("");
  const [currentProfilePicture, setCurrentProfilePicture] =
    useState<string>("");
  const [description, setDescription] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  const { user, updateUser } = useAuthContext();
  const { findOneByUsername, updatePrivacySettings, update } = useUserService();
  const { showToast } = useToast();

  const handleToggle = async (key: keyof typeof settings) => {
    const newSettings = { ...settings, [key]: !settings[key] };
    setSettings(newSettings);

    if (!user) return;
    await updatePrivacySettings(
      user.user_id,
      newSettings.privateContent,
      newSettings.privateLiked,
      newSettings.privatePinned,
      newSettings.likeDisable,
      newSettings.commentDisable,
      newSettings.followDisable
    );
    showToast("Privacy settings updated");
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProfileUpdate = async () => {
    if (!user || (!profileImage && !description)) {
      showToast("Please select an image or enter a description");
      return;
    }

    setIsUpdating(true);
    try {
      const formData = {
        profile: profileImage || new Blob(),
        creator_id: user.user_id,
        description: description,
      };

      const response = await update(formData);

      if (response?.profile_picture) {
        updateUser({
          profile_picture: response.profile_picture,
          desc: description,
        });
      }
      showToast("Profile updated successfully");
      setProfileImage(null);
      setProfileImagePreview("");
      setDescription("");
    } catch (error) {
      console.error("Failed to update profile:", error);
      showToast("Failed to update profile");
    } finally {
      setIsUpdating(false);
    }
  };

  useEffect(() => {
    if (!user) return;
    const fetchUserData = async () => {
      const userData = await findOneByUsername(user.username, user.area_id);

      if (!userData) return;
      setSettings({
        privateContent: userData.content_visibilityPrivate,
        privatePinned: userData.pinned_visibilityPrivate,
        privateLiked: userData.liked_visibilityPrivate,
        likeDisable: userData.liked_notification_disabled,
        commentDisable: userData.comments_notification_disabled,
        followDisable: userData.followers_notification_disabled,
      });
      setDescription(userData.desc || "");
      setCurrentProfilePicture(userData.profile_picture || "");
    };
    fetchUserData();
  }, [user]);

  return (
    <RootLayout>
      <div className="flex">
        <main className="flex-1 p-8 justify-center flex">
          <div className="max-w-2xl w-2xl">
            <h1 className="text-3xl font-bold text-foreground mb-8">
              Settings
            </h1>

            {/* Privacy Settings */}
            <Card className="border-border mb-6">
              <CardHeader>
                <CardTitle>Privacy Settings</CardTitle>
                <CardDescription>
                  Control who can see your content
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-foreground">
                      Private Content
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Hide your uploaded content
                    </p>
                  </div>
                  <Switch
                    checked={settings.privateContent}
                    onCheckedChange={() => handleToggle("privateContent")}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-foreground">
                      Private Pinned
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Hide your pinned content
                    </p>
                  </div>
                  <Switch
                    checked={settings.privatePinned}
                    onCheckedChange={() => handleToggle("privatePinned")}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-foreground">Private Liked</p>
                    <p className="text-sm text-muted-foreground">
                      Hide your liked content
                    </p>
                  </div>
                  <Switch
                    checked={settings.privateLiked}
                    onCheckedChange={() => handleToggle("privateLiked")}
                  />
                </div>
              </CardContent>
            </Card>
            {/* Notification Settings */}
            <Card className="border-border mb-6">
              <CardHeader>
                <CardTitle>Push Notification Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-foreground">
                      Like Notifications
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Disabled notifications for likes
                    </p>
                  </div>
                  <Switch
                    checked={settings.likeDisable}
                    onCheckedChange={() => handleToggle("likeDisable")}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-foreground">
                      Comment Notifications
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Disabled notifications for comments
                    </p>
                  </div>
                  <Switch
                    checked={settings.commentDisable}
                    onCheckedChange={() => handleToggle("commentDisable")}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-foreground">
                      Following Notifications
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Disable following notifications
                    </p>
                  </div>
                  <Switch
                    checked={settings.followDisable}
                    onCheckedChange={() => handleToggle("followDisable")}
                  />
                </div>
              </CardContent>
            </Card>
            {/* Profile Settings */}
            <Card className="border-border mb-6">
              <CardHeader>
                <CardTitle>Profile Settings</CardTitle>
                <CardDescription>
                  Update your profile information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Profile Image Upload */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-4">
                    Profile Picture
                  </label>
                  <div className="flex flex-col items-center gap-6">
                    {/* Current or Preview Image */}
                    <div className="relative group">
                      <img
                        src={profileImagePreview || currentProfilePicture}
                        alt="Profile picture"
                        className="w-32 h-32 rounded-full object-cover border-4 border-border cursor-pointer group-hover:opacity-80 transition-opacity"
                      />
                      <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                        <label className="cursor-pointer">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="hidden"
                          />
                          <span className="text-white text-sm font-medium">
                            Click to change
                          </span>
                        </label>
                      </div>
                    </div>

                    {/* Image Info */}
                    {profileImagePreview && (
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground mb-2">
                          New image selected
                        </p>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setProfileImage(null);
                            setProfileImagePreview("");
                          }}
                        >
                          Clear Selection
                        </Button>
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-4 text-center">
                    Supported formats: JPG, PNG, GIF (Max 5MB)
                  </p>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Bio/Description
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Write something about yourself..."
                    className="w-full px-3 py-2 border border-dark-700 rounded-md bg-dark-800 text-foreground text-sm placeholder-gray-500 focus:outline-none focus:border-burgundy-600 resize-none"
                    rows={4}
                  />
                  <p className="text-xs text-muted-foreground mt-2">
                    {description.length}/200 characters
                  </p>
                </div>

                {/* Update Button */}
                <Button
                  onClick={handleProfileUpdate}
                  disabled={isUpdating || (!profileImage && !description)}
                  className="w-full bg-burgundy-600 hover:bg-red-400 text-white "
                >
                  {isUpdating ? "Updating..." : "Update Profile"}
                </Button>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </RootLayout>
  );
}
