import { useState } from "react";
import { Plus, Info } from "lucide-react";
import type { RoomResponseDto } from "@/service/api";
import CreateRoomModal from "./CreateRoomModal";

interface RoomListProps {
  rooms: RoomResponseDto[];
  selectedRoom: string | null;
  chatType: "DIRECT" | "GROUP" | "COMMUNITY";
  onRoomSelect: (roomId: string) => void;
  onChatTypeChange: (type: "DIRECT" | "GROUP" | "COMMUNITY") => void;
  onRoomCreated?: () => void;
  onCommunityClick?: (community: RoomResponseDto) => void;
}

export default function RoomList({
  rooms,
  selectedRoom,
  chatType,
  onRoomSelect,
  onChatTypeChange,
  onRoomCreated,
  onCommunityClick,
}: RoomListProps) {
  const [showCreateModal, setShowCreateModal] = useState(false);

  return (
    <div className="w-90 border-r border-border flex flex-col bg-card shrink-0">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <h2 className="text-2xl font-bold text-foreground">Messages</h2>
      </div>

      {/* Type Filter with Create Button */}
      <div className="flex gap-2 p-4 border-b border-border items-center justify-between">
        <div className="flex gap-2 flex-1">
          {(["DIRECT", "GROUP", "COMMUNITY"] as const).map((type) => (
            <button
              key={type}
              onClick={() => onChatTypeChange(type)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                chatType === type
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-foreground hover:bg-muted/80"
              }`}
            >
              {type}
            </button>
          ))}
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className={`px-3 py-1 rounded-full text-sm font-medium transition-colors flex items-center gap-1 ${"bg-muted text-foreground hover:bg-muted/80"}`}
          title="Create new group or community"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Room List */}
      <div className="flex-1 overflow-y-auto space-y-1 p-2">
        {rooms.map((room) => (
          <div
            key={room.id}
            className={`w-full p-3 rounded-lg transition-colors relative group ${
              selectedRoom === room.id
                ? "bg-primary/20 border border-primary"
                : "hover:bg-muted"
            }`}
          >
            <button
              onClick={() => onRoomSelect(room.id)}
              className="w-full text-left"
            >
              <div className="flex items-center gap-3">
                <img
                  src={room.pictureUrl}
                  alt={room.name}
                  width={40}
                  height={40}
                  className="w-10 h-10 rounded-full"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground text-sm truncate">
                    {room.name}
                  </p>
                </div>
              </div>
            </button>
            {chatType === "COMMUNITY" && onCommunityClick && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onCommunityClick(room);
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-muted/80 hover:bg-muted opacity-0 group-hover:opacity-100 transition-opacity"
                title="View community details"
              >
                <Info className="w-4 h-4 text-foreground" />
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Create Room Modal */}
      <CreateRoomModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onRoomCreated={() => {
          setShowCreateModal(false);
          onRoomCreated?.();
        }}
      />
    </div>
  );
}
