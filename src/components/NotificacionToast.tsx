import React, { useEffect } from "react";
import type { NotificacionWebSocket } from "../interfaces/websocket.interface";

interface NotificacionToastProps {
  notificacion: NotificacionWebSocket;
  onClose: () => void;
  autoClose?: number;
}

const NotificacionToast: React.FC<NotificacionToastProps> = ({
  notificacion,
  onClose,
  autoClose = 5000,
}) => {
  useEffect(() => {
    if (autoClose) {
      const timer = setTimeout(onClose, autoClose);
      return () => clearTimeout(timer);
    }
  }, [autoClose, onClose]);

  const getIcon = () => {
    switch (notificacion.tipo) {
      case "incidente_creado":
        return "🆕";
      case "incidente_actualizado":
        return "🔄";
      default:
        return "📢";
    }
  };

  const getBackgroundColor = () => {
    switch (notificacion.tipo) {
      case "incidente_creado":
        return "bg-blue-50 border-blue-200";
      case "incidente_actualizado":
        return "bg-green-50 border-green-200";
      default:
        return "bg-gray-50 border-gray-200";
    }
  };

  return (
    <div
      className={`${getBackgroundColor()} border rounded-lg shadow-lg p-4 mb-3 min-w-[320px] max-w-md animate-slide-in-right`}
    >
      <div className="flex items-start gap-3">
        <div className="text-2xl flex-shrink-0">{getIcon()}</div>
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-slate-900 text-sm mb-1">
            {notificacion.titulo}
          </h4>
          <p className="text-sm text-slate-600 break-words">
            {notificacion.mensaje}
          </p>
          <p className="text-xs text-slate-400 mt-1">
            {new Date(notificacion.timestamp).toLocaleTimeString("es-PE")}
          </p>
        </div>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-slate-600 flex-shrink-0"
          aria-label="Cerrar notificación"
        >
          ✕
        </button>
      </div>
    </div>
  );
};

export default NotificacionToast;
