import { useState, useCallback } from "react";
import {
  UserService,
  type CreateUserDto,
  type UpdateProfileUserDto,
  type UpdateRestriction,
  type deltaDto,
  type NameRequest,
  type CredentialRes,
  type Ack,
  type UserDto,
} from "@/services/api";
import { useToast } from "../context/ToastContext";
import { useLoading } from "../context/LoadingContext";

interface UseUserServiceReturn {
  userData: UserDto | null;
  userListData: UserDto[] | null;
  credentialResData: CredentialRes | null;
  ackData: Ack | null;
  error: string | null;
  isLoading: boolean;

  createUser: (dto: CreateUserDto) => Promise<Ack>;
  findAllUsers: (area: number) => Promise<UserDto[]>;
  findUserById: (id: number) => Promise<UserDto>;
  updateUserProfile: (
    id: number,
    dto: UpdateProfileUserDto
  ) => Promise<UserDto>;
  updateUserLike: (id: number, dto: deltaDto) => Promise<Ack>;
  updateUserFollow: (id: number, dto: deltaDto) => Promise<Ack>;
  updateUserReport: (id: number, dto: deltaDto) => Promise<Ack>;
  updateUserRestriction: (id: number, dto: UpdateRestriction) => Promise<Ack>;
  findUserByName: (dto: NameRequest) => Promise<CredentialRes | null>;
  removeUser: (id: number) => Promise<Ack>;
  resetError: () => void;
}

export default function useUserService(): UseUserServiceReturn {
  const { showToast } = useToast();
  const { showLoading, hideLoading } = useLoading();

  const [userData, setUserData] = useState<UserDto | null>(null);
  const [userListData, setUserListData] = useState<UserDto[] | null>(null);
  const [credentialResData, setCredentialResData] =
    useState<CredentialRes | null>(null);
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

  const createUser = useCallback(
    async (dto: CreateUserDto): Promise<Ack> => {
      setIsLoading(true);
      showLoading();
      resetError();
      try {
        const result = await UserService.userControllerCreate(dto);
        setAckData(result);
        showToast("User created successfully");
        return result;
      } catch (err) {
        handleError(err, "User registration failed. Please try again.");
        throw err;
      } finally {
        setIsLoading(false);
        hideLoading();
      }
    },
    [showLoading, hideLoading, resetError, handleError, showToast]
  );

  const findAllUsers = useCallback(
    async (area: number): Promise<UserDto[]> => {
      setIsLoading(true);
      showLoading();
      resetError();
      try {
        const result = await UserService.userControllerFindAll(area);
        setUserListData(Array.isArray(result) ? result : [result]);
        return Array.isArray(result) ? result : [result];
      } catch (err) {
        handleError(err, "Failed to fetch users. Please try again.");
        throw err;
      } finally {
        setIsLoading(false);
        hideLoading();
      }
    },
    [showLoading, hideLoading, resetError, handleError]
  );

  const findUserById = useCallback(
    async (id: number): Promise<UserDto> => {
      setIsLoading(true);
      showLoading();
      resetError();
      try {
        const result = await UserService.userControllerFindOne(id);
        setUserData(result);
        return result;
      } catch (err) {
        handleError(err, "Failed to fetch user. Please try again.");
        throw err;
      } finally {
        setIsLoading(false);
        hideLoading();
      }
    },
    [showLoading, hideLoading, resetError, handleError]
  );

  const updateUserProfile = useCallback(
    async (id: number, dto: UpdateProfileUserDto): Promise<UserDto> => {
      setIsLoading(true);
      showLoading();
      resetError();
      try {
        const result = await UserService.userControllerUpdate(id, dto);
        setUserData(result);
        showToast("Profile updated successfully");
        return result;
      } catch (err) {
        handleError(err, "Failed to update profile. Please try again.");
        throw err;
      } finally {
        setIsLoading(false);
        hideLoading();
      }
    },
    [showLoading, hideLoading, resetError, handleError, showToast]
  );

  const updateUserLike = useCallback(
    async (id: number, dto: deltaDto): Promise<Ack> => {
      setIsLoading(true);
      resetError();
      try {
        const result = await UserService.userControllerUpdateLike(id, dto);
        setAckData(result);
        showToast("Like updated");
        return result;
      } catch (err) {
        handleError(err, "Failed to update like. Please try again.");
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [resetError, handleError, showToast]
  );

  const updateUserFollow = useCallback(
    async (id: number, dto: deltaDto): Promise<Ack> => {
      setIsLoading(true);
      resetError();
      try {
        const result = await UserService.userControllerUpdateFollow(id, dto);
        setAckData(result);
        showToast("Follow updated");
        return result;
      } catch (err) {
        handleError(err, "Failed to update follow. Please try again.");
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [resetError, handleError, showToast]
  );

  const updateUserReport = useCallback(
    async (id: number, dto: deltaDto): Promise<Ack> => {
      setIsLoading(true);
      resetError();
      try {
        const result = await UserService.userControllerUpdateReport(id, dto);
        setAckData(result);
        showToast("Report submitted");
        return result;
      } catch (err) {
        handleError(err, "Failed to submit report. Please try again.");
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [resetError, handleError, showToast]
  );

  const updateUserRestriction = useCallback(
    async (id: number, dto: UpdateRestriction): Promise<Ack> => {
      setIsLoading(true);
      showLoading();
      resetError();
      try {
        const result = await UserService.userControllerUpdateRestriction(
          id,
          dto
        );
        setAckData(result);
        showToast("Restriction updated");
        return result;
      } catch (err) {
        handleError(err, "Failed to update restriction. Please try again.");
        throw err;
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
        setCredentialResData(result);
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
    async (id: number): Promise<Ack> => {
      setIsLoading(true);
      showLoading();
      resetError();
      try {
        const result = await UserService.userControllerRemove(id);
        showToast("User removed successfully");
        return result;
      } catch (err) {
        handleError(err, "Failed to remove user. Please try again.");
        throw err;
      } finally {
        setIsLoading(false);
        hideLoading();
      }
    },
    [showLoading, hideLoading, resetError, handleError, showToast]
  );

  return {
    userData,
    userListData,
    credentialResData,
    ackData,
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
