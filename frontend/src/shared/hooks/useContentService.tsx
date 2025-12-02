import { ContentService } from "../../service/api/services/ContentService";
import type { FullContentDto } from "../../service/api/models/FullContentDto";
import type { deltaDto } from "../../service/api/models/deltaDto";
import type { Ack } from "../../service/api/models/Ack";
import useApiCall from "./useApiCall";
import type { PageContentRes } from "@/service/api";

interface CreateContentFormData {
  thumbnail?: Blob;
  contents?: Array<Blob>;
  creator_id: number;
  area_id: number;
  post_type: string;
  title: string;
  description: string;
  parent_id?: number;
  visibilityPrivate: boolean;
  published_at: string;
}

export default function useContentService() {
  const { call, data, loading, error } = useApiCall();

  const create = (formData: CreateContentFormData) =>
    call<FullContentDto>(() =>
      ContentService.contentControllerCreate(formData)
    );

  const getByUser = (creatorId: number) =>
    call<FullContentDto[]>(() =>
      ContentService.contentControllerGetByUser(creatorId)
    );

  const getByUserAll = (creatorId: number) =>
    call<FullContentDto[]>(() =>
      ContentService.contentControllerGetByUserAll(creatorId)
    );

  const getFollowingContent = (userId: number, areaId: number, page: number) =>
    call<PageContentRes>(() =>
      ContentService.contentControllerGetFollowingContent(userId, areaId, page)
    );

  const getFriendContent = (userId: number, areaId: number, page: number) =>
    call<PageContentRes>(() =>
      ContentService.contentControllerGetFriendContent(userId, areaId, page)
    );

  const getLikedByUser = (userId: number) =>
    call<FullContentDto[]>(() =>
      ContentService.contentControllerGetLikedByUser(userId)
    );

  const getPinnedByUser = (userId: number) =>
    call<FullContentDto[]>(() =>
      ContentService.contentControllerGetPinnedByUser(userId)
    );

  const getAncestorPost = (contentId: number, areaId: number) =>
    call<FullContentDto[]>(() =>
      ContentService.contentControllerGetAncestorPost(contentId, areaId)
    );
  const getChildPost = (parentId: number) =>
    call<FullContentDto[]>(() =>
      ContentService.contentControllerGetChildPost(parentId)
    );

  const getFullPost = (contentId: number, areaId: number) =>
    call<FullContentDto>(() =>
      ContentService.contentControllerGetFullPost(contentId, areaId)
    );

  const findAll = (areaId: number) =>
    call<FullContentDto[]>(() =>
      ContentService.contentControllerFindAll(areaId)
    );

  const findOne = (contentId: number, areaId: number) =>
    call<FullContentDto>(() =>
      ContentService.contentControllerFindOne(contentId, areaId)
    );

  const remove = (contentId: number, areaId: number) =>
    call<Ack>(() => ContentService.contentControllerRemove(contentId, areaId));

  const updateView = (contentId: number, areaId: number, dto: deltaDto) =>
    call<Ack>(() =>
      ContentService.contentControllerUpdateView(contentId, areaId, dto)
    );

  const updateLike = (contentId: number, areaId: number, dto: deltaDto) =>
    call<Ack>(() =>
      ContentService.contentControllerUpdateLike(contentId, areaId, dto)
    );

  const updatePin = (contentId: number, areaId: number, dto: deltaDto) =>
    call<Ack>(() =>
      ContentService.contentControllerUpdatePin(contentId, areaId, dto)
    );

  const updateComment = (contentId: number, areaId: number, dto: deltaDto) =>
    call<Ack>(() =>
      ContentService.contentControllerUpdateComment(contentId, areaId, dto)
    );

  const updateReport = (contentId: number, areaId: number, dto: deltaDto) =>
    call<Ack>(() =>
      ContentService.contentControllerUpdateReport(contentId, areaId, dto)
    );

  const updateScore = (dto: any) =>
    call<Ack>(() => ContentService.contentControllerUpdateScore(dto));

  const getByUserAllPublic = (creatorId: number) =>
    call<FullContentDto[]>(() =>
      ContentService.contentControllerGetByUserAllPublic(creatorId)
    );

  const findAllPage = (areaId: number, page: number, limit: number) =>
    call<any>(() =>
      ContentService.contentControllerFindAllPage(areaId, page, limit)
    );

  return {
    create,
    getByUser,
    getByUserAll,
    getByUserAllPublic,
    getFollowingContent,
    getFriendContent,
    getLikedByUser,
    getPinnedByUser,
    getAncestorPost,
    getFullPost,
    getChildPost,
    findAll,
    findAllPage,
    findOne,
    remove,
    updateView,
    updateLike,
    updatePin,
    updateComment,
    updateReport,
    updateScore,
    result: data,
    loading,
    error,
  };
}
