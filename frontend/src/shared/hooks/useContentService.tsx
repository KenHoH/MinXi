import { useState, useCallback } from "react";
import {
  ContentService,
  type CreatePostDto,
  type CreateFileDto,
  type FullContentDto,
  type FileRes,
  type Ack,
  type deltaDto,
  type UploadFilesResDto,
} from "@/services/api";
import { useToast } from "../context/ToastContext";
import { useLoading } from "../context/LoadingContext";
interface UseContentServiceReturn {
  // State - typed DTOs
  contentData: FullContentDto | null;
  contentsData: FullContentDto[] | null;
  fileResData: FileRes | null;
  uploadedFilesData: UploadFilesResDto | null;
  ackData: Ack | null;
  error: string | null;
  isLoading: boolean;

  // Methods
  create: (dto: CreatePostDto) => Promise<void>;
  createFile: (dto: CreateFileDto) => Promise<void>;
  uploadMultipleFiles: (formData: {
    image: Blob;
    video: Blob;
  }) => Promise<void>;
  uploadContentImages: (formData: {
    thumbnail: Blob;
    contentImage: Blob;
  }) => Promise<void>;
  uploadProfilePicture: (formData: { profileImage: Blob }) => Promise<void>;
  getByUser: (creatorId: number) => Promise<void>;
  getFollowingContent: (userId: number) => Promise<void>;
  getFriendContent: (userId: number) => Promise<void>;
  findAll: (areaId: number) => Promise<void>;
  findOne: (contentId: number, areaId: number) => Promise<void>;
  remove: (contentId: number, areaId: number) => Promise<void>;
  updateView: (
    contentId: number,
    areaId: number,
    dto: deltaDto
  ) => Promise<void>;
  updateLike: (
    contentId: number,
    areaId: number,
    dto: deltaDto
  ) => Promise<void>;
  updatePin: (
    contentId: number,
    areaId: number,
    dto: deltaDto
  ) => Promise<void>;
  updateComment: (
    contentId: number,
    areaId: number,
    dto: deltaDto
  ) => Promise<void>;
  updateReport: (
    contentId: number,
    areaId: number,
    dto: deltaDto
  ) => Promise<void>;
  setPrivate: (contentId: number, areaId: number) => Promise<void>;
  setPublic: (contentId: number, areaId: number) => Promise<void>;
  resetError: () => void;
}

export default function useContentService(): UseContentServiceReturn {
  const { showToast } = useToast();
  const { showLoading, hideLoading } = useLoading();

  const [contentData, setContentData] = useState<FullContentDto | null>(null);
  const [contentsData, setContentsData] = useState<FullContentDto[] | null>(
    null
  );
  const [fileResData, setFileResData] = useState<FileRes | null>(null);
  const [uploadedFilesData, setUploadedFilesData] = useState<any | null>(null);
  const [ackData, setAckData] = useState<Ack | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const resetError = useCallback(() => setError(null), []);

  const handleError = useCallback(
    (err: unknown, defaultMessage: string) => {
      const message = err instanceof Error ? err.message : defaultMessage;
      setError(message);
      showToast(message);
    },
    [showToast]
  );

  const create = useCallback(
    async (dto: CreatePostDto) => {
      setIsLoading(true);
      showLoading();
      resetError();
      try {
        const result = await ContentService.contentControllerCreate(dto);
        setContentData(result);
        showToast("Content created successfully");
      } catch (err) {
        handleError(err, "Failed to create content. Please try again.");
      } finally {
        setIsLoading(false);
        hideLoading();
      }
    },
    [showLoading, hideLoading, resetError, handleError, showToast]
  );

  const createFile = useCallback(
    async (dto: CreateFileDto) => {
      setIsLoading(true);
      resetError();
      try {
        const result = await ContentService.contentControllerCreateFile(dto);
        setFileResData(result);
      } catch (err) {
        handleError(err, "Failed to create file. Please try again.");
      } finally {
        setIsLoading(false);
      }
    },
    [resetError, handleError]
  );

  const uploadMultipleFiles = useCallback(
    async (formData: { image: Blob; video: Blob }) => {
      setIsLoading(true);
      resetError();
      try {
        const result =
          await ContentService.contentControllerUploadMultipleFiles(formData);
        setUploadedFilesData(result);
        showToast("Files uploaded successfully");
      } catch (err) {
        handleError(err, "Failed to upload files. Please try again.");
      } finally {
        setIsLoading(false);
      }
    },
    [resetError, handleError, showToast]
  );

  const uploadContentImages = useCallback(
    async (formData: { thumbnail: Blob; contentImage: Blob }) => {
      setIsLoading(true);
      resetError();
      try {
        const result = await ContentService.contentControllerUploadImageContent(
          formData
        );
        setUploadedFilesData(result);
        showToast("Content images uploaded successfully");
      } catch (err) {
        handleError(err, "Failed to upload content images. Please try again.");
      } finally {
        setIsLoading(false);
      }
    },
    [resetError, handleError, showToast]
  );

  const uploadProfilePicture = useCallback(
    async (formData: { profileImage: Blob }) => {
      setIsLoading(true);
      resetError();
      try {
        const result = await ContentService.contentControllerUploadProfile(
          formData as any
        );
        setUploadedFilesData(result);
        showToast("Profile picture uploaded successfully");
      } catch (err) {
        handleError(err, "Failed to upload profile picture. Please try again.");
      } finally {
        setIsLoading(false);
      }
    },
    [resetError, handleError, showToast]
  );

  const getByUser = useCallback(
    async (creatorId: number) => {
      setIsLoading(true);
      showLoading();
      resetError();
      try {
        const result = await ContentService.contentControllerGetByUser(
          creatorId
        );
        setContentsData(result);
      } catch (err) {
        handleError(err, "Failed to fetch user content. Please try again.");
      } finally {
        setIsLoading(false);
        hideLoading();
      }
    },
    [showLoading, hideLoading, resetError, handleError]
  );

  const getFollowingContent = useCallback(
    async (userId: number) => {
      setIsLoading(true);
      showLoading();
      resetError();
      try {
        const result =
          await ContentService.contentControllerGetFollowingContent(userId);
        setContentsData(result);
      } catch (err) {
        handleError(
          err,
          "Failed to fetch following content. Please try again."
        );
      } finally {
        setIsLoading(false);
        hideLoading();
      }
    },
    [showLoading, hideLoading, resetError, handleError]
  );

  const getFriendContent = useCallback(
    async (userId: number) => {
      setIsLoading(true);
      showLoading();
      resetError();
      try {
        const result = await ContentService.contentControllerGetFriendContent(
          userId
        );
        setContentsData(result);
      } catch (err) {
        handleError(err, "Failed to fetch friend content. Please try again.");
      } finally {
        setIsLoading(false);
        hideLoading();
      }
    },
    [showLoading, hideLoading, resetError, handleError]
  );

  const findAll = useCallback(
    async (areaId: number) => {
      setIsLoading(true);
      showLoading();
      resetError();
      try {
        const result = await ContentService.contentControllerFindAll(areaId);
        setContentsData(result);
      } catch (err) {
        handleError(err, "Failed to fetch content. Please try again.");
      } finally {
        setIsLoading(false);
        hideLoading();
      }
    },
    [showLoading, hideLoading, resetError, handleError]
  );

  const findOne = useCallback(
    async (contentId: number, areaId: number) => {
      setIsLoading(true);
      showLoading();
      resetError();
      try {
        const result = await ContentService.contentControllerFindOne(
          contentId,
          areaId
        );
        setContentData(result);
      } catch (err) {
        handleError(err, "Failed to fetch content. Please try again.");
      } finally {
        setIsLoading(false);
        hideLoading();
      }
    },
    [showLoading, hideLoading, resetError, handleError]
  );

  const remove = useCallback(
    async (contentId: number, areaId: number) => {
      setIsLoading(true);
      showLoading();
      resetError();
      try {
        const result = await ContentService.contentControllerRemove(
          contentId,
          areaId
        );
        setAckData(result);
        showToast("Content deleted successfully");
      } catch (err) {
        handleError(err, "Failed to delete content. Please try again.");
      } finally {
        setIsLoading(false);
        hideLoading();
      }
    },
    [showLoading, hideLoading, resetError, handleError, showToast]
  );

  const updateView = useCallback(
    async (contentId: number, areaId: number, dto: deltaDto) => {
      setIsLoading(true);
      resetError();
      try {
        const result = await ContentService.contentControllerUpdateView(
          contentId,
          areaId,
          dto
        );
        setAckData(result);
      } catch (err) {
        handleError(err, "Failed to update view. Please try again.");
      } finally {
        setIsLoading(false);
      }
    },
    [resetError, handleError]
  );

  const updateLike = useCallback(
    async (contentId: number, areaId: number, dto: deltaDto) => {
      setIsLoading(true);
      resetError();
      try {
        const result = await ContentService.contentControllerUpdateLike(
          contentId,
          areaId,
          dto
        );
        setAckData(result);
        showToast("Like updated");
      } catch (err) {
        handleError(err, "Failed to update like. Please try again.");
      } finally {
        setIsLoading(false);
      }
    },
    [resetError, handleError, showToast]
  );

  const updatePin = useCallback(
    async (contentId: number, areaId: number, dto: deltaDto) => {
      setIsLoading(true);
      resetError();
      try {
        const result = await ContentService.contentControllerUpdatePin(
          contentId,
          areaId,
          dto
        );
        setAckData(result);
        showToast("Pin updated");
      } catch (err) {
        handleError(err, "Failed to update pin. Please try again.");
      } finally {
        setIsLoading(false);
      }
    },
    [resetError, handleError, showToast]
  );

  const updateComment = useCallback(
    async (contentId: number, areaId: number, dto: deltaDto) => {
      setIsLoading(true);
      resetError();
      try {
        const result = await ContentService.contentControllerUpdateComment(
          contentId,
          areaId,
          dto
        );
        setAckData(result);
      } catch (err) {
        handleError(err, "Failed to update comment. Please try again.");
      } finally {
        setIsLoading(false);
      }
    },
    [resetError, handleError]
  );

  const updateReport = useCallback(
    async (contentId: number, areaId: number, dto: deltaDto) => {
      setIsLoading(true);
      resetError();
      try {
        const result = await ContentService.contentControllerUpdateReport(
          contentId,
          areaId,
          dto
        );
        setAckData(result);
      } catch (err) {
        handleError(err, "Failed to update report. Please try again.");
      } finally {
        setIsLoading(false);
      }
    },
    [resetError, handleError]
  );

  const setPrivate = useCallback(
    async (contentId: number, areaId: number) => {
      setIsLoading(true);
      showLoading();
      resetError();
      try {
        const result = await ContentService.contentControllerSetPrivate(
          contentId,
          areaId
        );
        setAckData(result);
        showToast("Content set to private");
      } catch (err) {
        handleError(err, "Failed to set content as private. Please try again.");
      } finally {
        setIsLoading(false);
        hideLoading();
      }
    },
    [showLoading, hideLoading, resetError, handleError, showToast]
  );

  const setPublic = useCallback(
    async (contentId: number, areaId: number) => {
      setIsLoading(true);
      showLoading();
      resetError();
      try {
        const result = await ContentService.contentControllerSetPublic(
          contentId,
          areaId
        );
        setAckData(result);
        showToast("Content set to public");
      } catch (err) {
        handleError(err, "Failed to set content as public. Please try again.");
      } finally {
        setIsLoading(false);
        hideLoading();
      }
    },
    [showLoading, hideLoading, resetError, handleError, showToast]
  );

  return {
    contentData,
    contentsData,
    fileResData,
    uploadedFilesData,
    ackData,
    error,
    isLoading,
    create,
    createFile,
    uploadMultipleFiles,
    uploadContentImages,
    uploadProfilePicture,
    getByUser,
    getFollowingContent,
    getFriendContent,
    findAll,
    findOne,
    remove,
    updateView,
    updateLike,
    updatePin,
    updateComment,
    updateReport,
    setPrivate,
    setPublic,
    resetError,
  };
}
