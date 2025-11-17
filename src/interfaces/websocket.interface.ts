export type TipoNotificacion = "incidente_creado" | "incidente_actualizado";

export interface NotificacionWebSocket {
  tipo: TipoNotificacion;
  titulo: string;
  mensaje: string;
  incidente_id: string;
  timestamp: string;
}
