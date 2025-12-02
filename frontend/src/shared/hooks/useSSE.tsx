import { useEffect, useRef, useState } from "react";
import type {
  RoomMessage,
  SSEPayload,
  UserNotification,
} from "../api/models/sse/sseResponse";

export function useSSE(roomId: string) {
  const [messages, setMessages] = useState<RoomMessage[]>([]);
  const [notifications, setNotifications] = useState<UserNotification[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const esRef = useRef<EventSource | null>(null);

  useEffect(() => {
    if (!roomId) return;
    const url = `http://localhost:3000/sse/subscribe/rooms/${roomId}`;

    try {
      const es = new EventSource(url);
      esRef.current = es;

      es.onopen = () => {
        console.log("SSE Connected");
        setIsConnected(true);
        setError(null);
      };

      es.onerror = (err) => {
        console.error("SSE Error:", err);
        setIsConnected(false);
        setError("Failed to connect to SSE");
      };

      es.onmessage = (event) => {
        try {
          const payload: SSEPayload = JSON.parse(event.data);

          console.log("SSE Event Received:", payload);
          if (payload.type === "NEW_MESSAGE") {
            const data = payload.data;

            if ("authorId" in data && "roomId" in data) {
              console.log("New Room Message:", data);
              setMessages((prev) => [...prev, data as RoomMessage]);
              return;
            }

            if ("userId" in data && "title" in data) {
              console.log("New User Notification:", data);
              setNotifications((prev) => [...prev, data as UserNotification]);
              return;
            }

            console.warn("Unknown SSE data format:", data);
          }
        } catch (err) {
          console.error("Failed to parse SSE event:", err);
          setError("Failed to parse SSE event");
        }
      };

      return () => {
        console.log("Closing SSE");
        es.close();
        setIsConnected(false);
      };
    } catch (err) {
      console.error("Failed to initialize SSE:", err);
      setError("Failed to initialize SSE");
    }
  }, [roomId]);

  return {
    messages,
    notifications,
    isConnected,
    error,
  };
}
