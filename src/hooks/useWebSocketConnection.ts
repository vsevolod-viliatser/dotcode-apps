import { useCallback, useEffect, useRef, useState } from "react";

interface UseWebSocketConnectionOptions {
  url: string;
  enabled?: boolean;
  onMessage?: (data: unknown) => void;
  onOpen?: () => void;
  onClose?: () => void;
  onError?: (error: Event) => void;
}

export const useWebSocketConnection = (
  options: UseWebSocketConnectionOptions
) => {
  const { url, enabled = false, onMessage, onOpen, onClose, onError } = options;
  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const wsRef = useRef<WebSocket | null>(null);

  const connect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      return;
    }

    setConnectionError(null);

    try {
      const ws = new WebSocket(url);

      ws.onopen = () => {
        console.log("WebSocket connected to", url);
        setIsConnected(true);
        setConnectionError(null);
        onOpen?.();

        if (url.includes("blockchain.info")) {
          ws.send(JSON.stringify({ op: "unconfirmed_sub" }));
        }
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          onMessage?.(data);
        } catch (error) {
          console.error("Error parsing WebSocket message:", error);
        }
      };

      ws.onerror = (error) => {
        console.error("WebSocket error:", error);
        setConnectionError("Failed to connect to WebSocket");
        setIsConnected(false);
        onError?.(error);
      };

      ws.onclose = () => {
        console.log("WebSocket connection closed");
        setIsConnected(false);
        setConnectionError("Connection closed");
        onClose?.();
      };

      wsRef.current = ws;
    } catch (error) {
      console.error("Error creating WebSocket:", error);
      setConnectionError("Failed to create WebSocket connection");
    }
  }, [url, onMessage, onOpen, onClose, onError]);

  const disconnect = useCallback(() => {
    if (wsRef.current) {
      if (url.includes("blockchain.info")) {
        wsRef.current.send(JSON.stringify({ op: "unconfirmed_unsub" }));
      }
      wsRef.current.close();
      wsRef.current = null;
    }
    setIsConnected(false);
    setConnectionError(null);
  }, [url]);

  const sendMessage = useCallback((message: unknown) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(message));
    }
  }, []);

  useEffect(() => {
    if (enabled) {
      connect();
    } else {
      disconnect();
    }

    return () => {
      disconnect();
    };
  }, [enabled, connect, disconnect]);

  return {
    isConnected,
    connectionError,
    connect,
    disconnect,
    sendMessage,
  };
};
