// services/incidentes.ts
import Api from "../api";
import type { AxiosResponse } from "axios";

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
  created_at?: string
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
 * Listar Incidentes (paginado) con filtros opcionales
 * POST /incidente/list
 * body: { page, size, estado?, tipo?, nivel_urgencia? }
 * Nota: opcionalmente se puede pasar `role` al llamar la función para mapear
 * la forma de los items según el rol del solicitante (cliente-side).
 */
export interface ListarIncidentesRequest {
  page: number;
  size: number;
  // filtros opcionales soportados por el backend
  estado?: EstadoIncidente;
  tipo?: TipoIncidente;
  nivel_urgencia?: NivelUrgencia;
}

export interface PaginacionResponse<T = any> {
  contents: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export type Role = "estudiante" | "autoridad" | "administrador_empleado" | string;

export async function listarIncidentes(
  payload: ListarIncidentesRequest,
  role?: Role,
): Promise<AxiosResponse<PaginacionResponse<any>>> {
  const api = await Api.getInstance("reportes");

  // Hacer POST a `/incidentes/listar` y dejar que el backend aplique los filtros
  const resp = await api.post<ListarIncidentesRequest, PaginacionResponse<any>>(payload, {
    url: "/incidentes/listar",
  });

  // si no se especifica role, devolvemos la respuesta tal cual
  if (!role) return resp;

  // mapear según rol: estudiante => resumen, autoridad/administrador_empleado => detalle
  const isStudent = role === "estudiante";

  const original = resp.data || { contents: [] };

  const mappedContents = (original.contents || []).map((item: any) => {
    if (isStudent) {
      return {
        titulo: item.titulo,
        piso: item.piso,
        tipo: item.tipo,
        nivel_urgencia: item.nivel_urgencia,
        estado: item.estado,
        created_at: item.created_at,
        updated_at: item.updated_at,
      };
    }

    // autoridad / administrador_empleado -> detalle completo
    return {
      incidente_id: item.incidente_id || item.id || item.uuid,
      titulo: item.titulo,
      descripcion: item.descripcion,
      piso: item.piso,
      ubicacion: item.ubicacion || item.ubicacion_text || item.ubicacion_descripcion,
      tipo: item.tipo,
      nivel_urgencia: item.nivel_urgencia,
      evidencias: item.evidencias || [],
      estado: item.estado,
      usuario_correo: item.usuario_correo || item.reportado_por_email,
      created_at: item.created_at,
      updated_at: item.updated_at,
      coordenadas: item.coordenadas || item.location || null,
    };
  });

  // Reemplazar el data en la respuesta para mantener compatibilidad con llamados existentes
  resp.data = {
    contents: mappedContents,
    page: original.page,
    size: original.size,
    totalElements: original.totalElements,
    totalPages: original.totalPages,
  } as PaginacionResponse<any>;

  return resp;
}

/**
 * Listar Historial de un usuario (paginado)
 * POST /incidentes/historial
 * body: { page, size, estado?, tipo?, nivel_urgencia? }
 */
export async function listarHistorial(
  payload: ListarIncidentesRequest,
): Promise<AxiosResponse<PaginacionResponse<any>>> {
  const api = await Api.getInstance("reportes");

  return api.post<ListarIncidentesRequest, PaginacionResponse<any>>(payload, {
    url: "/incidentes/historial",
  });
}


