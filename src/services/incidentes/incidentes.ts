// services/incidentes.ts
import Api from "../api";

export type TipoIncidente =
  | "mantenimiento"
  | "seguridad"
  | "limpieza"
  | "TI"
  | "otro"
  | string;

export type NivelUrgencia = "bajo" | "medio" | "alto" | "critico" | string;

export type EstadoIncidente =
  | "reportado"
  | "en_progreso"
  | "resuelto"
  | string;

export interface Ubicacion {
  x: number;
  y: number;
}

export interface Evidencia {
  filename: string;
  content_type: string;
  file_base64: string;
}

export interface Incidente {
  incidente_id: string;
  titulo: string;
  descripcion: string;
  piso: number;
  ubicacion: Ubicacion;
  tipo: TipoIncidente;
  nivel_urgencia: NivelUrgencia;
  estado?: EstadoIncidente;
  usuario_correo?: string;
}

/**
 * Crear Incidente (Estudiante)
 * POST /incidentes/crear
 */
export interface CrearIncidenteRequest {
  titulo: string;
  descripcion: string;
  piso: number;
  ubicacion: Ubicacion;
  tipo: TipoIncidente;
  nivel_urgencia: NivelUrgencia;
  evidencias?: Evidencia[]; // array según README
}

export interface CrearIncidenteResponse {
  message: string;
  incidente: Incidente;
}

export async function crearIncidente(payload: CrearIncidenteRequest) {
  const api = await Api.getInstance("reportes");

  return api.post<CrearIncidenteRequest, CrearIncidenteResponse>(payload, {
    url: "/incidentes/crear",
  });
}

/**
 * Actualizar Incidente (Estudiante)
 * PUT /incidentes/update
 * (puedes hacer los campos opcionales si el backend soporta parches parciales)
 */
export interface ActualizarIncidenteRequest {
  incidente_id: string;
  titulo?: string;
  descripcion?: string;
  piso?: number;
  ubicacion?: Ubicacion;
  tipo?: TipoIncidente;
  nivel_urgencia?: NivelUrgencia;
  evidencias?: Evidencia[];
}

export async function actualizarIncidente(payload: ActualizarIncidenteRequest) {
  const api = await Api.getInstance("reportes");

  return api.put<ActualizarIncidenteRequest, { message: string; incidente: Incidente }>(
    payload,
    { url: "/incidentes/update" },
  );
}

/**
 * Actualizar Estado de Incidente (Personal)
 * PUT /incidentes/update_estado
 */
export interface ActualizarEstadoIncidenteRequest {
  incidente_id: string;
  estado: EstadoIncidente;
  // requerido por el backend cuando estado = "en_progreso"
  empleado_correo?: string;
  // opcional, pero útil cuando se marca como "resuelto"
  comentario_resolucion?: string;
}

export async function actualizarEstadoIncidente(
  payload: ActualizarEstadoIncidenteRequest,
) {
  const api = await Api.getInstance("reportes");

  return api.put<
    ActualizarEstadoIncidenteRequest,
    { message: string; incidente: Incidente }
  >(payload, {
    url: "/incidentes/update_estado",
  });
}

/**
 * Buscar Incidente (Autoridad)
 * POST /incidentes/buscar
 */
export interface BuscarIncidenteRequest {
  incidente_id: string;
}

export interface BuscarIncidenteResponse {
  incidente: Incidente;
}

export async function buscarIncidente(payload: BuscarIncidenteRequest) {
  const api = await Api.getInstance("reportes");

  return api.post<BuscarIncidenteRequest, BuscarIncidenteResponse>(payload, {
    url: "/incidentes/buscar",
  });
}

/**
 * Listar Incidentes
 * POST /incidentes/listar
 * body: { page, size, limit? }
 */
export interface ListarIncidentesRequest {
  page: number;
  size: number;
  limit?: number;
}

export interface ListarIncidentesResponse {
  contents: Incidente[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export async function listarIncidentes(payload: ListarIncidentesRequest) {
  const api = await Api.getInstance("reportes");

  return api.post<ListarIncidentesRequest, ListarIncidentesResponse>(payload, {
    url: "/incidentes/listar",
  });
}
