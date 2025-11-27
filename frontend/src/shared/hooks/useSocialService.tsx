import { useState, useCallback } from "react";
import {
  SocialService,
  type CreateRoomDto,
  type AddUserToRoomDto,
  type RemoveUserFromRoomDto,
  type UpdateParticipantRoleDto,
  type SendMessageDto,
  type FindDmDto,
  type RoomResponseDto,
  type ParticipantResponseDto,
  type MessageResponseDto,
  type ParticipantTotalResDTO,
} from "@/services/api";
import { useToast } from "../context/ToastContext";
import { useLoading } from "../context/LoadingContext";

interface UseSocialServiceReturn {
  roomData: RoomResponseDto | null;
  roomsData: RoomResponseDto[] | null;
  participantData: ParticipantResponseDto | null;
  participantTotalData: ParticipantTotalResDTO | null;
  messageData: MessageResponseDto | null;
  messagesData: MessageResponseDto[] | null;
  error: string | null;
  isLoading: boolean;

  createRoom: (dto: CreateRoomDto) => Promise<RoomResponseDto>;
  getRoomInfo: (roomId: string) => Promise<RoomResponseDto>;
  getAllRooms: (userId: number) => Promise<RoomResponseDto[]>;
  addUserToRoom: (dto: AddUserToRoomDto) => Promise<ParticipantResponseDto>;
  removeUserFromRoom: (
    dto: RemoveUserFromRoomDto
  ) => Promise<ParticipantResponseDto>;
  updateParticipantRole: (
    dto: UpdateParticipantRoleDto
  ) => Promise<ParticipantResponseDto>;
  getTotalParticipants: (roomId: string) => Promise<ParticipantTotalResDTO>;
  getParticipant: (roomId: string) => Promise<ParticipantResponseDto>;
  getMedia: (roomId: string) => Promise<MessageResponseDto>;
  sendMessage: (dto: SendMessageDto) => Promise<MessageResponseDto>;
  getMessages: (roomId: string, limit: number) => Promise<MessageResponseDto[]>;
  findDm: (dto: FindDmDto) => Promise<RoomResponseDto>;
  resetError: () => void;
}

export default function useSocialService(): UseSocialServiceReturn {
  const { showToast } = useToast();
  const { showLoading, hideLoading } = useLoading();

  const [roomData, setRoomData] = useState<RoomResponseDto | null>(null);
  const [roomsData, setRoomsData] = useState<RoomResponseDto[] | null>(null);
  const [participantData, setParticipantData] =
    useState<ParticipantResponseDto | null>(null);
  const [participantTotalData, setParticipantTotalData] =
    useState<ParticipantTotalResDTO | null>(null);
  const [messageData, setMessageData] = useState<MessageResponseDto | null>(
    null
  );
  const [messagesData, setMessagesData] = useState<MessageResponseDto[] | null>(
    null
  );
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

  const createRoom = useCallback(
    async (dto: CreateRoomDto): Promise<RoomResponseDto> => {
      setIsLoading(true);
      showLoading();
      resetError();
      try {
        const result = await SocialService.socialControllerCreateRoom(dto);
        setRoomData(result);
        showToast("Room created successfully");
        return result;
      } catch (err) {
        handleError(err, "Failed to create room. Please try again.");
        throw err;
      } finally {
        setIsLoading(false);
        hideLoading();
      }
    },
    [showLoading, hideLoading, resetError, handleError, showToast]
  );

  const getRoomInfo = useCallback(
    async (roomId: string): Promise<RoomResponseDto> => {
      setIsLoading(true);
      showLoading();
      resetError();
      try {
        const result = await SocialService.socialControllerGetRoomInfo(roomId);
        setRoomData(result);
        return result;
      } catch (err) {
        handleError(err, "Failed to fetch room information. Please try again.");
        throw err;
      } finally {
        setIsLoading(false);
        hideLoading();
      }
    },
    [showLoading, hideLoading, resetError, handleError]
  );

  const getAllRooms = useCallback(
    async (userId: number): Promise<RoomResponseDto[]> => {
      setIsLoading(true);
      showLoading();
      resetError();
      try {
        const result = await SocialService.socialControllerGetAllRoomId(userId);
        setRoomsData(result);
        return result;
      } catch (err) {
        handleError(err, "Failed to fetch rooms. Please try again.");
        throw err;
      } finally {
        setIsLoading(false);
        hideLoading();
      }
    },
    [showLoading, hideLoading, resetError, handleError]
  );

  const addUserToRoom = useCallback(
    async (dto: AddUserToRoomDto): Promise<ParticipantResponseDto> => {
      setIsLoading(true);
      resetError();
      try {
        const result = await SocialService.socialControllerAddUserToRoom(dto);
        setParticipantData(result);
        showToast("User added to room");
        return result;
      } catch (err) {
        handleError(err, "Failed to add user to room. Please try again.");
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [resetError, handleError, showToast]
  );

  const removeUserFromRoom = useCallback(
    async (dto: RemoveUserFromRoomDto): Promise<ParticipantResponseDto> => {
      setIsLoading(true);
      resetError();
      try {
        const result = await SocialService.socialControllerRemoveUserFromRoom(
          dto
        );
        setParticipantData(result);
        showToast("User removed from room");
        return result;
      } catch (err) {
        handleError(err, "Failed to remove user from room. Please try again.");
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [resetError, handleError, showToast]
  );

  const updateParticipantRole = useCallback(
    async (dto: UpdateParticipantRoleDto): Promise<ParticipantResponseDto> => {
      setIsLoading(true);
      resetError();
      try {
        const result =
          await SocialService.socialControllerUpdateParticipantRole(dto);
        setParticipantData(result);
        showToast("Participant role updated");
        return result;
      } catch (err) {
        handleError(
          err,
          "Failed to update participant role. Please try again."
        );
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [resetError, handleError, showToast]
  );

  const getTotalParticipants = useCallback(
    async (roomId: string): Promise<ParticipantTotalResDTO> => {
      setIsLoading(true);
      resetError();
      try {
        const result = await SocialService.socialControllerGetTotalParticipants(
          roomId
        );
        setParticipantTotalData(result);
        return result;
      } catch (err) {
        handleError(
          err,
          "Failed to fetch participant total. Please try again."
        );
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [resetError, handleError]
  );

  const getParticipant = useCallback(
    async (roomId: string): Promise<ParticipantResponseDto> => {
      setIsLoading(true);
      showLoading();
      resetError();
      try {
        const result = await SocialService.socialControllerGetParticipant(
          roomId
        );
        setParticipantData(result);
        return result;
      } catch (err) {
        handleError(err, "Failed to fetch participant. Please try again.");
        throw err;
      } finally {
        setIsLoading(false);
        hideLoading();
      }
    },
    [showLoading, hideLoading, resetError, handleError]
  );

  const getMedia = useCallback(
    async (roomId: string): Promise<MessageResponseDto> => {
      setIsLoading(true);
      showLoading();
      resetError();
      try {
        const result = await SocialService.socialControllerGetMedia(roomId);
        setMessageData(result);
        return result;
      } catch (err) {
        handleError(err, "Failed to fetch media. Please try again.");
        throw err;
      } finally {
        setIsLoading(false);
        hideLoading();
      }
    },
    [showLoading, hideLoading, resetError, handleError]
  );

  const sendMessage = useCallback(
    async (dto: SendMessageDto): Promise<MessageResponseDto> => {
      setIsLoading(true);
      resetError();
      try {
        const result = await SocialService.socialControllerSendMessage(dto);
        setMessageData(result);
        return result;
      } catch (err) {
        handleError(err, "Failed to send message. Please try again.");
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [resetError, handleError]
  );

  const getMessages = useCallback(
    async (roomId: string, limit: number): Promise<MessageResponseDto[]> => {
      setIsLoading(true);
      showLoading();
      resetError();
      try {
        const result = await SocialService.socialControllerGetMessage(
          roomId,
          limit
        );
        setMessagesData(result);
        return result;
      } catch (err) {
        handleError(err, "Failed to fetch messages. Please try again.");
        throw err;
      } finally {
        setIsLoading(false);
        hideLoading();
      }
    },
    [showLoading, hideLoading, resetError, handleError]
  );

  const findDm = useCallback(
    async (dto: FindDmDto): Promise<RoomResponseDto> => {
      setIsLoading(true);
      showLoading();
      resetError();
      try {
        const result = await SocialService.socialControllerFindDm(dto);
        setRoomData(result);
        return result;
      } catch (err) {
        handleError(err, "Failed to find DM. Please try again.");
        throw err;
      } finally {
        setIsLoading(false);
        hideLoading();
      }
    },
    [showLoading, hideLoading, resetError, handleError]
  );

  return {
    roomData,
    roomsData,
    participantData,
    participantTotalData,
    messageData,
    messagesData,
    error,
    isLoading,
    createRoom,
    getRoomInfo,
    getAllRooms,
    addUserToRoom,
    removeUserFromRoom,
    updateParticipantRole,
    getTotalParticipants,
    getParticipant,
    getMedia,
    sendMessage,
    getMessages,
    findDm,
    resetError,
  };
}
