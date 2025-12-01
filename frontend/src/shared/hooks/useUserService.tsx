import { UserService } from "../../service/api/services/UserService";
import type { CreateUserDto } from "../../service/api/models/CreateUserDto";
import type { Ack } from "../../service/api/models/Ack";
import useApiCall from "./useApiCall";
import type { deltaDto } from "@/service/api";

export default function useUserService() {
  const { call, data, loading, error } = useApiCall();
  const create = (dto: CreateUserDto) =>
    call<Ack>(() => UserService.userControllerCreate(dto));

  const findUserById = (userId: number) =>
    call(() => UserService.userControllerFindOne(userId));

  const findByUsername = (username: string, areaId: number) =>
    call(() =>
      UserService.userControllerFindByName({
        name: username,
        area_id: areaId,
      })
    );

  const findOneByUsername = (username: string, areaId: number) =>
    call(() =>
      UserService.userControllerFindOneByName({
        name: username,
        area_id: areaId,
      })
    );

  const updateLikeUser = (id: number, req: deltaDto) =>
    call(() => UserService.userControllerUpdateLike(id, req));

  const updateFollowUser = (id: number, req: deltaDto) =>
    call(() => UserService.userControllerUpdateFollow(id, req));

  const updateReportUser = (id: number, req: deltaDto) =>
    call(() => UserService.userControllerUpdateReport(id, req));

  const updatePrivacySettings = (
    id: number,
    content_visibility: boolean,
    liked_visibility: boolean,
    pinned_visibility: boolean,
    likeDisable: boolean,
    commentDisable: boolean,
    followDisable: boolean
  ) =>
    call(() =>
      UserService.userControllerUpdateRestriction(id, {
        content_visibility,
        liked_visibility,
        pinned_visibility,
        liked_notification_disabled: likeDisable,
        comments_notification_disabled: commentDisable,
        followers_notification_disabled: followDisable,
      })
    );

  const update = (formData: {
    profile: Blob;
    creator_id: number;
    description: string;
  }) => call(() => UserService.userControllerUpdate(formData));

  return {
    create,
    findUserById,
    findByUsername,
    findOneByUsername,
    updateLikeUser,
    updateFollowUser,
    updateReportUser,
    updatePrivacySettings,
    update,
    result: data,
    loading,
    error,
  };
}
