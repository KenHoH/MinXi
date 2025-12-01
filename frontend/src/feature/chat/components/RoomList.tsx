import type { RoomResponseDto } from "@/service/api";

interface RoomListProps {
  rooms: RoomResponseDto[];
  selectedRoom: string | null;
  chatType: "DIRECT" | "GROUP" | "COMMUNITY";
  onRoomSelect: (roomId: string) => void;
  onChatTypeChange: (type: "DIRECT" | "GROUP" | "COMMUNITY") => void;
}

export default function RoomList({
  rooms,
  selectedRoom,
  chatType,
  onRoomSelect,
  onChatTypeChange,
}: RoomListProps) {
  return (
    <div className="w-80 border-r border-border flex flex-col bg-card shrink-0">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <h2 className="text-2xl font-bold text-foreground">Messages</h2>
      </div>

      {/* Type Filter */}
      <div className="flex gap-2 p-4 border-b border-border">
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

      {/* Room List */}
      <div className="flex-1 overflow-y-auto space-y-1 p-2">
        {rooms.map((room) => (
          <button
            key={room.id}
            onClick={() => onRoomSelect(room.id)}
            className={`w-full p-3 rounded-lg text-left transition-colors ${
              selectedRoom === room.id
                ? "bg-primary/20 border border-primary"
                : "hover:bg-muted"
            }`}
          >
            <div className="flex items-center gap-3 mb-2">
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
        ))}
      </div>
    </div>
  );
}
