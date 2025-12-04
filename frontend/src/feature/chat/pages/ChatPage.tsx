"use client";

import { useEffect, useState } from "react";
import RootLayout from "@/app/LayoutPage";
import RoomList from "../components/RoomList";
import ChatArea from "../components/ChatArea";
import { dummyMessages } from "../constants";
import useSocialService from "@/shared/hooks/useSocialService";
import type { RoomResponseDto } from "@/service/api/models/RoomResponseDto";
import { useAuthContext } from "@/feature/auth/context/AuthContext";
import type { UserDto, UserRoleDto } from "@/service/api";
import useUserService from "@/shared/hooks/useUserService";
import { useSSE } from "@/shared/hooks/useSSE";
import useSseService from "@/shared/hooks/useSseService";

export default function ChatPage() {
  // State declarations first
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [messageList, setMessageList] = useState<any[]>([]);
  const [chatType, setChatType] = useState<"DIRECT" | "GROUP" | "COMMUNITY">(
    "DIRECT"
  );
  const [roomDm, setRoomDm] = useState<RoomResponseDto[]>([]);
  const [groups, setGroups] = useState<RoomResponseDto[]>([]);
  const [communities, setCommunities] = useState<RoomResponseDto[]>([]);
  const [loggedUser, setLoggedUser] = useState<UserDto | null>(null);
  const [members, setMembers] = useState<UserRoleDto[]>([]);
  const [currentUserRole, setCurrentUserRole] = useState("MEMBER");
  const { messages: sseMessages, isConnected } = useSSE(selectedRoom || "");

  // Hooks
  const { user } = useAuthContext();
  const { findUserById } = useUserService();
  const {
    getRoomDmByUserId,
    getRoomGroupJoinedByUserId,
    getRoomCommunityJoinedByUserId,
    getRoomCommunityAll,
    getMessage,
    getParticipantInstance,
  } = useSocialService();
  const { sendBroadcast } = useSseService();

  // Derived state (can use state variables now)
  const currentRoom = selectedRoom
    ? roomDm.find((r) => r.id === selectedRoom) ||
      groups.find((r) => r.id === selectedRoom) ||
      communities.find((r) => r.id === selectedRoom)
    : null;

  const getRoomsByType = () => {
    switch (chatType) {
      case "DIRECT":
        return roomDm;
      case "GROUP":
        return groups;
      case "COMMUNITY":
        return communities;
      default:
        return [];
    }
  };

  const filteredRooms = getRoomsByType();

  // Debug: Log room changes
  useEffect(() => {
    console.log("Updated Rooms - DMs:", roomDm);
    console.log("Updated Rooms - Groups:", groups);
    console.log("Updated Rooms - Communities:", communities);
  }, [roomDm, groups, communities]);

  // Merge SSE messages with fetched messages
  useEffect(() => {
    if (sseMessages && sseMessages.length > 0 && selectedRoom) {
      setMessageList((prevMessages) => {
        const messageIds = new Set(prevMessages.map((m: any) => m.id));
        const newMessages = sseMessages.filter(
          (m: any) => !messageIds.has(m.id) && m.roomId === selectedRoom
        );
        if (newMessages.length > 0) {
          console.log("Adding new SSE messages:", newMessages);
          return [...prevMessages, ...newMessages];
        }
        return prevMessages;
      });
    }
  }, [sseMessages, selectedRoom]);

  const getUserDM = async () => {
    if (!user) return;
    const res = await getRoomDmByUserId(user.user_id);
    if (res && res.length > 0) {
      const fullResponse: RoomResponseDto[] = [];
      for (const room of res) {
        const otherUser = room.participants.find(
          (p) => p.user_id !== user.user_id
        );
        if (otherUser) {
          fullResponse.push({
            id: room.id,
            name: otherUser.username,
            pictureUrl: otherUser.profile_picture || "",
            type: room.type,
            createdAt: room.createdAt,
            updatedAt: room.updatedAt,
          });
        }
      }
      console.log("Converted DM Rooms:", fullResponse);
      setRoomDm(fullResponse);
    }
  };
  const getUserGroups = async () => {
    if (!user) return;
    const res = await getRoomGroupJoinedByUserId(user.user_id);
    if (res) {
      setGroups(res);
    }
  };
  const getUserCommunities = async () => {
    if (!user) return;
    const res = await getRoomCommunityJoinedByUserId(user.user_id);
    if (res) {
      setCommunities(res);
    }
  };
  const getAllCommunitiesInstance = async () => {
    const res = await getRoomCommunityAll();
    if (res) {
      setCommunities(res);
    }
  };

  useEffect(() => {
    if (!user) return;

    const fetchAllRooms = async () => {
      console.log("Fetching rooms for user:", user.user_id);
      await getUserDM();
      await getUserGroups();
      await getUserCommunities();
      await getAllCommunitiesInstance();
    };

    fetchAllRooms();
  }, [user]);

  useEffect(() => {
    const fetchLoggedUser = async () => {
      if (!user) return;
      const res = await findUserById(user.user_id);
      if (res) {
        setLoggedUser(res);
        console.log("Logged user fetched:", res);
      }
    };
    fetchLoggedUser();
  }, [user]);

  useEffect(() => {
    const fetchMessages = async () => {
      if (selectedRoom) {
        const res = await getMessage(selectedRoom, 100);
        if (res && Array.isArray(res)) {
          // Transform MessageResponseDto to RoomMessage format
          const transformedMessages = res.map((msg: any) => ({
            id: msg.id,
            authorId: msg.authorId,
            content: msg.content,
            mediaUrl: msg.mediaUrl || "",
            createdAt: msg.createdAt,
            roomId: msg.roomId,
            type: msg.type,
            authorName: msg.authorName || "",
            authorProfileUrl: msg.authorProfileUrl || "",
          }));
          setMessageList(transformedMessages);
          console.log(
            "Messages for room",
            selectedRoom,
            ":",
            transformedMessages
          );
        }
      } else {
        setMessageList([]);
      }
    };
    fetchMessages();
  }, [selectedRoom]);

  const handleSendMessage = async (content: string, fileBlob?: Blob) => {
    if (content.trim() && currentRoom && loggedUser) {
      sendBroadcast({
        author_id: loggedUser.user_id,
        room_id: currentRoom.id,
        message: content,
        metadata: fileBlob,
        author_name: loggedUser.username,
        author_profile_url: loggedUser.profile_picture,
      });
    }
  };

  useEffect(() => {
    const fetchParticipantsAndRole = async () => {
      if (currentRoom && user) {
        const members = await getParticipantInstance(currentRoom.id);
        if (!members) return;
        setMembers(members);
        const currentRole = members.find((p) => p.user_id === user.user_id);
        if (currentRole) setCurrentUserRole(currentRole.role);
      }
    };
    fetchParticipantsAndRole();
  }, [currentRoom, user]);

  return (
    <RootLayout>
      <div className="flex h-screen">
        <main className="ml-0 flex-1 flex overflow-hidden">
          <RoomList
            rooms={filteredRooms}
            selectedRoom={selectedRoom}
            chatType={chatType}
            onRoomSelect={setSelectedRoom}
            onChatTypeChange={setChatType}
            onRoomCreated={() => {
              // Refresh rooms when a new one is created
              if (user) {
                getUserDM();
                getUserGroups();
                getUserCommunities();
              }
            }}
          />

          {currentRoom ? (
            <ChatArea
              room={currentRoom}
              messages={messageList}
              onSendMessage={handleSendMessage}
              isConnected={isConnected}
              loggedUserId={user?.user_id}
              members={members}
              currentUserRole={currentUserRole}
            />
          ) : (
            <div className="flex-1 flex items-center justify-center bg-background text-muted-foreground">
              <p>Select a conversation to start messaging</p>
            </div>
          )}
        </main>
      </div>
    </RootLayout>
  );
}
