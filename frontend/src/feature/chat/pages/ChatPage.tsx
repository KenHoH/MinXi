"use client";

import { useState } from "react";
import { Send, MoreVertical } from "lucide-react";
import RootLayout from "@/app/LayoutPage";

interface Message {
  id: string;
  authorId: number;
  content: string;
  createdAt: string;
}

interface Room {
  id: string;
  name: string;
  pictureUrl: string;
  type: "DM" | "GROUP" | "COMMUNITY";
  lastMessage: string;
}

// Dummy data
const dummyRooms: Room[] = [
  {
    id: "1",
    name: "Alex Johnson",
    pictureUrl: "",
    type: "DM",
    lastMessage: "Hey! How are you?",
  },
  {
    id: "2",
    name: "Design Crew",
    pictureUrl: "",
    type: "GROUP",
    lastMessage: "New design approved!",
  },
  {
    id: "3",
    name: "Photography Tips",
    pictureUrl: "",
    type: "COMMUNITY",
    lastMessage: "Check out this tutorial",
  },
  {
    id: "4",
    name: "Sarah Smith",
    pictureUrl: "",
    type: "DM",
    lastMessage: "See you soon!",
  },
];

const dummyMessages: Message[] = [
  {
    id: "1",
    authorId: 101,
    content: "Hey! How are you?",
    createdAt: "10:30 AM",
  },
  {
    id: "2",
    authorId: 102,
    content: "I'm doing great! How about you?",
    createdAt: "10:32 AM",
  },
  {
    id: "3",
    authorId: 101,
    content: "All good! Just finished a project",
    createdAt: "10:35 AM",
  },
  {
    id: "4",
    authorId: 102,
    content: "That's awesome! Would love to see it",
    createdAt: "10:37 AM",
  },
];

export default function ChatPage() {
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [messageInput, setMessageInput] = useState("");
  const [messages, setMessages] = useState(dummyMessages);
  const [chatType, setChatType] = useState<"DM" | "GROUP" | "COMMUNITY">("DM");

  const currentRoom = selectedRoom
    ? dummyRooms.find((r) => r.id === selectedRoom)
    : null;
  const filteredRooms = dummyRooms.filter((r) => r.type === chatType);

  const handleSendMessage = () => {
    if (messageInput.trim()) {
      setMessages([
        ...messages,
        {
          id: Date.now().toString(),
          authorId: 102,
          content: messageInput,
          createdAt: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ]);
      setMessageInput("");
    }
  };

  return (
    <RootLayout>
      <div className="flex h-screen">
        <main className="ml-0 flex-1 flex overflow-hidden">
          {/* Chat List */}
          <div className="w-80 border-r border-border flex flex-col bg-card shrink-0">
            {/* Header */}
            <div className="p-4 border-b border-border">
              <h2 className="text-2xl font-bold text-foreground">Messages</h2>
            </div>

            {/* Type Filter */}
            <div className="flex gap-2 p-4 border-b border-border">
              {(["DM", "GROUP", "COMMUNITY"] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setChatType(type)}
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
              {filteredRooms.map((room) => (
                <button
                  key={room.id}
                  onClick={() => setSelectedRoom(room.id)}
                  className={`w-full p-3 rounded-lg text-left transition-colors ${
                    selectedRoom === room.id
                      ? "bg-primary/20 border border-primary"
                      : "hover:bg-muted"
                  }`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <img
                      src="/abstract-profile.png"
                      alt={room.name}
                      width={40}
                      height={40}
                      className="w-10 h-10 rounded-full"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground text-sm truncate">
                        {room.name}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {room.lastMessage}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Chat Area */}
          {currentRoom ? (
            <div className="flex-1 flex flex-col bg-background">
              {/* Chat Header */}
              <div className="p-4 border-b border-border flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src="/abstract-profile.png"
                    alt={currentRoom.name}
                    width={40}
                    height={40}
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <p className="font-semibold text-foreground">
                      {currentRoom.name}
                    </p>
                    <p className="text-xs text-muted-foreground">Online</p>
                  </div>
                </div>
                <button className="p-2 hover:bg-muted rounded-lg transition-colors">
                  <MoreVertical className="w-5 h-5 text-foreground" />
                </button>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.authorId === 102 ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-xs px-4 py-2 rounded-lg ${
                        message.authorId === 102
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-foreground"
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                      <p
                        className={`text-xs mt-1 ${
                          message.authorId === 102
                            ? "opacity-70"
                            : "text-muted-foreground"
                        }`}
                      >
                        {message.createdAt}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Message Input */}
              <div className="p-4 border-t border-border">
                <div className="flex gap-3">
                  <input
                    type="text"
                    placeholder="Type a message..."
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        handleSendMessage();
                      }
                    }}
                    className="flex-1 px-4 py-2 bg-input border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                  <button
                    onClick={handleSendMessage}
                    className="p-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
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
