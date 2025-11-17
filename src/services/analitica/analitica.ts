// services/analitica/analitica.ts
import Api from "../api";
import type {
  TriggerETLResponse,
  IncidentesPorPisoResponse,
  IncidentesPorTipoResponse,
  TiempoResolucionResponse,
  ReportesPorUsuarioResponse,
} from "../../interfaces/analitica/AnaliticaResponse";

// ============================================
// FUNCIONES DE SERVICIO - Analítica
// ============================================

/**
 * Iniciar proceso ETL de Airflow
 * POST /analitica/trigger-etl
 * 
 * Dispara el proceso de extracción, transformación y carga de datos
 * para actualizar las métricas analíticas.
 */
export async function triggerETL() {
  const api = await Api.getInstance("analitica");

  return api.post<void, TriggerETLResponse>(undefined, {
    url: "/analitica/trigger-etl",
  });
}

/**
 * Obtener incidentes agrupados por piso
 * GET /analitica/incidentes-por-piso
 * 
 * Retorna la cantidad de incidentes agrupados por cada piso del edificio.
 */
export async function getIncidentesPorPiso() {
  const api = await Api.getInstance("analitica");

  return api.get<void, IncidentesPorPisoResponse>({
    url: "/analitica/incidentes-por-piso",
  });
}

/**
 * Obtener incidentes agrupados por tipo
 * GET /analitica/incidentes-por-tipo
 * 
 * Retorna la cantidad de incidentes agrupados por tipo de problema
 * (limpieza, mantenimiento, ti, seguridad, etc.).
 */
export async function getIncidentesPorTipo() {
  const api = await Api.getInstance("analitica");

  return api.get<void, IncidentesPorTipoResponse>({
    url: "/analitica/incidentes-por-tipo",
  });
}

/**
 * Obtener métricas de tiempo de resolución
 * GET /analitica/tiempo-resolucion
 * 
 * Retorna estadísticas sobre los tiempos de resolución de incidentes:
 * tiempo promedio, mínimo, máximo, etc.
 */
export async function getTiempoResolucion() {
  const api = await Api.getInstance("analitica");

  return api.get<void, TiempoResolucionResponse>({
    url: "/analitica/tiempo-resolucion",
  });
}

/**
 * Obtener reportes agrupados por usuario
 * GET /analitica/reportes-por-usuario
 * 
 * Retorna estadísticas de incidentes reportados por cada usuario,
 * incluyendo el desglose por estado (pendiente, en progreso, resuelto).
 */
export async function getReportesPorUsuario() {
  const api = await Api.getInstance("analitica");

  return api.get<void, ReportesPorUsuarioResponse>({
    url: "/analitica/reportes-por-usuario",
  });
}
