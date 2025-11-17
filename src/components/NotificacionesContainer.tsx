import React from "react";
import NotificacionToast from "./NotificacionToast";
import type { NotificacionWebSocket } from "../interfaces/websocket.interface";

interface NotificacionConId extends NotificacionWebSocket {
  id: string;
}

interface NotificacionesContainerProps {
  notificaciones: NotificacionConId[];
  onRemove: (id: string) => void;
}

const NotificacionesContainer: React.FC<NotificacionesContainerProps> = ({
  notificaciones,
  onRemove,
}) => {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {notificaciones.map((notificacion) => (
        <NotificacionToast
          key={notificacion.id}
          notificacion={notificacion}
          onClose={() => onRemove(notificacion.id)}
        />
      ))}
    </div>
  );
};

export default NotificacionesContainer;
