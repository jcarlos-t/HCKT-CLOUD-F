// interfaces/empleados.ts
import Api from "../api";

export type TipoArea = "ti" | "mantenimiento" | "seguridad" | string;
export type EstadoEmpleado = "activo" | "inactivo" | string;

export interface EmpleadoContacto {
  telefono: string;
  correo: string;
}

export interface Empleado {
  empleado_id?: string;
  nombre: string;
  tipo_area: TipoArea;
  estado: EstadoEmpleado;
  contacto?: EmpleadoContacto; // opcional según README
}

export interface CrearEmpleadoRequest {
  nombre: string;
  tipo_area: TipoArea;
  estado: EstadoEmpleado;
  contacto?: EmpleadoContacto;
}

export interface CrearEmpleadoResponse {
  message: string;
  empleado: Empleado;
}

export interface ListarEmpleadosRequest {
  limit: number;
  size: number;
  last_key?: string | null;
  estado?: EstadoEmpleado;
}

export interface ListarEmpleadosResponse {
  empleados: Empleado[];
  count: number;
  last_key?: string | null;
}

/**
 * Crear empleado (P.A. o Autoridad)
 * POST /empleados/crear
 */
export async function crearEmpleado(payload: CrearEmpleadoRequest) {
  const api = await Api.getInstance("usuarios");

  return api.post<CrearEmpleadoRequest, CrearEmpleadoResponse>(payload, {
    url: "/empleados/crear",
  });
}

/**
 * Listar Empleados (P.A. o Autoridad)
 * POST /empleados/listar
 */
export async function listarEmpleados(payload: ListarEmpleadosRequest) {
  const api = await Api.getInstance("usuarios");

  return api.post<ListarEmpleadosRequest, ListarEmpleadosResponse>(payload, {
    url: "/empleados/listar",
  });
}

export interface ModificarEmpleadoRequest {
  empleado_id: string;
  nombre: string;
  tipo_area: TipoArea;
  estado: EstadoEmpleado;
  contacto?: EmpleadoContacto;
}

export interface ModificarEmpleadoResponse {
  message: string;
  empleado: Empleado;
}

/**
 * Actualizar empleado (P.A. o Autoridad)
 * PUT /empleados/modificar
 */
export async function modificarEmpleado(payload: ModificarEmpleadoRequest) {
  const api = await Api.getInstance("usuarios");

  return api.put<ModificarEmpleadoRequest, ModificarEmpleadoResponse>(payload, {
    url: "/empleados/modificar",
  });
}

export interface EliminarEmpleadoRequest {
  empleado_id: string;
}

export interface EliminarEmpleadoResponse {
  message: string;
}

/**
 * Eliminar empleado (P.A. o Autoridad)
 * DELETE /empleados/eliminar
 */
export async function eliminarEmpleado(payload: EliminarEmpleadoRequest) {
  const api = await Api.getInstance("usuarios");

  return api.delete({
    url: "/empleados/eliminar",
    data: payload,
  });
}
