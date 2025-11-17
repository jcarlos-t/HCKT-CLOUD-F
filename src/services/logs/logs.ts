// src/services/logs/logs.ts
import Api from "../api";
import type {
  ListarLogsRequest,
  ListarLogsResponse,
} from "../../interfaces/logs/LogsResponse";

/**
 * Listar logs del sistema
 * Obtiene logs de auditoría y sistema con paginación y filtros opcionales
 */
export const listarLogs = async (params: ListarLogsRequest) => {
  const api = await Api.getInstance("logs");
  return api.post<ListarLogsRequest, ListarLogsResponse>(params, {
    url: "/logs/listar",
  });
};

// Re-exportar tipos para facilitar importación
export type {
  ListarLogsRequest,
  ListarLogsResponse,
  LogEntry,
  TipoLog,
  NivelLog,
  DetallesSistema,
  DetallesAuditoria,
} from "../../interfaces/logs/LogsResponse";
