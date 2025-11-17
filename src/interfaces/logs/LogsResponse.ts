// src/interfaces/logs/LogsResponse.ts

export type TipoLog = "sistema" | "auditoria";
export type NivelLog = "INFO" | "WARNING" | "ERROR" | "AUDIT";

export interface DetallesSistema {
  mensaje: string;
  servicio: string;
  contexto: Record<string, any>;
}

export interface DetallesAuditoria {
  entidad_id: string;
  operacion: string;
  usuario_correo: string;
  valores_previos: Record<string, any>;
  valores_nuevos: Record<string, any>;
  entidad: string;
}

export interface LogEntry {
  registro_id: string;
  tipo: TipoLog;
  nivel: NivelLog;
  marca_tiempo: string;
  detalles_sistema?: DetallesSistema;
  detalles_auditoria?: DetallesAuditoria;
}

export interface ListarLogsRequest {
  size: number;
  page?: number;
  nivel?: NivelLog;
  tipo?: TipoLog;
  servicio?: string;
  fecha_inicio?: string;
  fecha_fin?: string;
}

export interface ListarLogsResponse {
  contents: LogEntry[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}
