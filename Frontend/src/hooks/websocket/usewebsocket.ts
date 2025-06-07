// hooks/useWebSocket.ts
import { useEffect, useRef } from "react";

interface WebSocketConfig {
  url: string;
  onMessage: (data: any) => void;
  onOpen?: () => void;
  onClose?: () => void;
  onError?: (error: Event) => void;
}

export const useWebSocket = (config: WebSocketConfig) => {
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const socket = new WebSocket(config.url);
    socketRef.current = socket;

    socket.onopen = () => {
      console.log(`WebSocket connected to ${config.url}`);
      config.onOpen?.();
    };

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        config.onMessage(data);
      } catch (error) {
        console.error("Error parsing WebSocket message:", error);
      }
    };

    socket.onerror = (error) => {
      console.error(`WebSocket error on ${config.url}:`, error);
      config.onError?.(error);
    };

    socket.onclose = () => {
      console.log(`WebSocket disconnected from ${config.url}`);
      config.onClose?.();
    };

    return () => {
      if (socket.readyState === WebSocket.OPEN) {
        socket.close();
      }
    };
  }, [config.url]);

  return socketRef;
};