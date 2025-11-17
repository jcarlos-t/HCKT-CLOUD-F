import { useEffect, useCallback } from "react";
import { webSocketService } from "../services/websocket/websocket.service";
import type { NotificacionWebSocket } from "../interfaces/websocket.interface";

export const useWebSocket = (
  token: string | null,
  onNotification: (notification: NotificacionWebSocket) => void
) => {
  const handleNotification = useCallback(
    (notification: NotificacionWebSocket) => {
      onNotification(notification);
    },
    [onNotification]
  );

  useEffect(() => {
    if (!token) {
      return;
    }

    // Conectar WebSocket
    webSocketService.connect(token);
    webSocketService.addListener(handleNotification);

    // Cleanup al desmontar
    return () => {
      webSocketService.removeListener(handleNotification);
      webSocketService.disconnect();
    };
  }, [token, handleNotification]);

  return {
    isConnected: webSocketService.isConnected(),
  };
};
