import { useAuthContext } from "@/feature/auth/context/AuthContext";
import { useEffect, useState } from "react";
import useConnectionService from "../hooks/useConnectionService";
import { useLoading } from "../context/LoadingContext";
import type { UserDto } from "@/service/api";

export default function useGetUserConnection() {
  const { user } = useAuthContext();
  const [isLoading, setIsloading] = useState(false);
  const { showLoading, hideLoading } = useLoading();
  const [followers, setFollowers] = useState<UserDto[]>([]);
  const [followings, setFollowings] = useState<UserDto[]>([]);
  const [friends, setFriends] = useState<UserDto[]>([]);
  const {
    getFollowersInstanceByCreator,
    getFollowingInstanceByUser,
    getFriendsInstanceByUser,
  } = useConnectionService();

  useEffect(() => {
    load();
  }, [user]);

  const load = async () => {
    if (!user) return;
    showLoading();
    setIsloading(true);
    const [followers, following, friends] = await Promise.all([
      getFollowersInstanceByCreator(user.user_id),
      getFollowingInstanceByUser(user.user_id),
      getFriendsInstanceByUser(user.user_id),
    ]);
    setIsloading(false);
    hideLoading();
    setFollowers(followers ?? []);
    setFollowings(following ?? []);
    setFriends(friends ?? []);
    return [followers, following, friends];
  };

  return { followers, followings, friends, load, isLoading };
}
