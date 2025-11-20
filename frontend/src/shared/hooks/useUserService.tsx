import { useState, useCallback } from "react";
import {
  UserService,
  type CreateUserDto,
  type UpdateProfileUserDto,
  type UpdateRestriction,
  type deltaDto,
  type NameRequest,
  type CredentialRes,
} from "@/services/api";
import { useToast } from "../context/ToastContext";
import { useLoading } from "../context/LoadingContext";

interface UseUserServiceReturn {
  // State
  data: unknown | null;
  error: string | null;
  isLoading: boolean;

  // Methods
  createUser: (dto: CreateUserDto) => Promise<void>;
  findAllUsers: (area: number) => Promise<void>;
  findUserById: (id: number) => Promise<void>;
  updateUserProfile: (id: number, dto: UpdateProfileUserDto) => Promise<void>;
  updateUserLike: (id: number, dto: deltaDto) => Promise<void>;
  updateUserFollow: (id: number, dto: deltaDto) => Promise<void>;
  updateUserReport: (id: number, dto: deltaDto) => Promise<void>;
  updateUserRestriction: (id: number, dto: UpdateRestriction) => Promise<void>;
  findUserByName: (dto: NameRequest) => Promise<CredentialRes | null>;
  removeUser: (id: number) => Promise<void>;
  resetError: () => void;
}

export default function useUserService(): UseUserServiceReturn {
  const { showToast } = useToast();
  const { showLoading, hideLoading } = useLoading();

  const [data, setData] = useState<unknown | null>(null);
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

  const createUser = useCallback(
    async (dto: CreateUserDto) => {
      setIsLoading(true);
      showLoading();
      resetError();
      try {
        const result = await UserService.userControllerCreate(dto);
        setData(result);
        showToast("User created successfully");
      } catch (err) {
        handleError(err, "User registration failed. Please try again.");
      } finally {
        setIsLoading(false);
        hideLoading();
      }
    },
    [showLoading, hideLoading, resetError, handleError, showToast]
  );

  const findAllUsers = useCallback(
    async (area: number) => {
      setIsLoading(true);
      showLoading();
      resetError();
      try {
        const result = await UserService.userControllerFindAll(area);
        setData(result);
      } catch (err) {
        handleError(err, "Failed to fetch users. Please try again.");
      } finally {
        setIsLoading(false);
        hideLoading();
      }
    },
    [showLoading, hideLoading, resetError, handleError]
  );

  const findUserById = useCallback(
    async (id: number) => {
      setIsLoading(true);
      showLoading();
      resetError();
      try {
        const result = await UserService.userControllerFindOne(id);
        setData(result);
      } catch (err) {
        handleError(err, "Failed to fetch user. Please try again.");
      } finally {
        setIsLoading(false);
        hideLoading();
      }
    },
    [showLoading, hideLoading, resetError, handleError]
  );

  const updateUserProfile = useCallback(
    async (id: number, dto: UpdateProfileUserDto) => {
      setIsLoading(true);
      showLoading();
      resetError();
      try {
        const result = await UserService.userControllerUpdate(id, dto);
        setData(result);
        showToast("Profile updated successfully");
      } catch (err) {
        handleError(err, "Failed to update profile. Please try again.");
      } finally {
        setIsLoading(false);
        hideLoading();
      }
    },
    [showLoading, hideLoading, resetError, handleError, showToast]
  );

  const updateUserLike = useCallback(
    async (id: number, dto: deltaDto) => {
      setIsLoading(true);
      resetError();
      try {
        const result = await UserService.userControllerUpdateLike(id, dto);
        setData(result);
        showToast("Like updated");
      } catch (err) {
        handleError(err, "Failed to update like. Please try again.");
      } finally {
        setIsLoading(false);
      }
    },
    [resetError, handleError, showToast]
  );

  const updateUserFollow = useCallback(
    async (id: number, dto: deltaDto) => {
      setIsLoading(true);
      resetError();
      try {
        const result = await UserService.userControllerUpdateFollow(id, dto);
        setData(result);
        showToast("Follow updated");
      } catch (err) {
        handleError(err, "Failed to update follow. Please try again.");
      } finally {
        setIsLoading(false);
      }
    },
    [resetError, handleError, showToast]
  );

  const updateUserReport = useCallback(
    async (id: number, dto: deltaDto) => {
      setIsLoading(true);
      resetError();
      try {
        const result = await UserService.userControllerUpdateReport(id, dto);
        setData(result);
        showToast("Report submitted");
      } catch (err) {
        handleError(err, "Failed to submit report. Please try again.");
      } finally {
        setIsLoading(false);
      }
    },
    [resetError, handleError, showToast]
  );

  const updateUserRestriction = useCallback(
    async (id: number, dto: UpdateRestriction) => {
      setIsLoading(true);
      showLoading();
      resetError();
      try {
        const result = await UserService.userControllerUpdateRestriction(
          id,
          dto
        );
        setData(result);
        showToast("Restriction updated");
      } catch (err) {
        handleError(err, "Failed to update restriction. Please try again.");
      } finally {
        setIsLoading(false);
        hideLoading();
      }
    },
    [showLoading, hideLoading, resetError, handleError, showToast]
  );

  const findUserByName = useCallback(
    async (dto: NameRequest): Promise<CredentialRes | null> => {
      setIsLoading(true);
      showLoading();
      resetError();
      try {
        const result = await UserService.userControllerFindByName(dto);
        setData(result);
        return result;
      } catch (err) {
        handleError(err, "Failed to find user. Please try again.");
        return null;
      } finally {
        setIsLoading(false);
        hideLoading();
      }
    },
    [showLoading, hideLoading, resetError, handleError]
  );

  const removeUser = useCallback(
    async (id: number) => {
      setIsLoading(true);
      showLoading();
      resetError();
      try {
        const result = await UserService.userControllerRemove(id);
        setData(result);
        showToast("User removed successfully");
      } catch (err) {
        handleError(err, "Failed to remove user. Please try again.");
      } finally {
        setIsLoading(false);
        hideLoading();
      }
    },
    [showLoading, hideLoading, resetError, handleError, showToast]
  );

  return {
    data,
    error,
    isLoading,
    createUser,
    findAllUsers,
    findUserById,
    updateUserProfile,
    updateUserLike,
    updateUserFollow,
    updateUserReport,
    updateUserRestriction,
    findUserByName,
    removeUser,
    resetError,
  };
}
