// services/usuarios.ts
import Api from "../api";

export interface Usuario {
  correo: string;
  nombre: string;
  rol: "estudiante" | "personal_administrativo" | "autoridad";
}

export interface UsuarioResponse {
  usuario: Usuario;
}

export interface ChangePasswordRequest {
  contrasena_actual: string;
  nueva_contrasena: string;
}

export interface ListUsuariosRequest {
  limit: number;
  size: number;
  last_key?: string | null;
}

export interface ListUsuariosResponse {
  usuarios: Usuario[];
  count: number;
  last_key?: string | null;
}

/**
 * Mi Usuario (GET /usuario/mi)
 */
export async function getMyUser() {
  const api = await Api.getInstance("usuarios");

  return api.get<void, UsuarioResponse>({
    url: "/usuario/mi",
  });
}

/**
 * Modificar Mi Usuario (PUT /usuario/modificar)
 * body:
 * {
 *   correo,          // correo actual
 *   nuevo_correo?,   // opcional
 *   nombre?          // opcional
 * }
 */
export interface UpdateMyUserRequest {
  correo: string;
  nuevo_correo?: string;
  nombre?: string;
}

export async function updateMyUser(payload: UpdateMyUserRequest) {
  const api = await Api.getInstance("usuarios");

  return api.put<UpdateMyUserRequest, { message: string; usuario: Usuario }>(
    payload,
    { url: "/usuario/modificar" },
  );
}

/**
 * Eliminar Mi Usuario (DELETE /usuario/eliminar)
 */
export async function deleteUserByCorreo(correo: string) {
  const api = await Api.getInstance("usuarios");

  return api.delete({
    url: "/usuario/eliminar",
    data: { correo },
  });
}

/**
 * Crear Usuario (Autoridad) (POST /usuario/crear)
 */
export interface CreateUserAsAutoridadRequest {
  nombre: string;
  correo: string;
  contrasena: string;
  rol: "estudiante" | "personal_administrativo" | "autoridad";
}

export interface CreateUserAsAutoridadResponse {
  message: string;
  usuario: Usuario;
}

export async function createUserAsAutoridad(
  payload: CreateUserAsAutoridadRequest,
) {
  const api = await Api.getInstance("usuarios");

  return api.post<CreateUserAsAutoridadRequest, CreateUserAsAutoridadResponse>(
    payload,
    { url: "/usuario/crear" },
  );
}

/**
 * Obtener Usuario (Autoridad / Personal)
 * GET /usuario/obtener?correo=...
 */
export async function getUserByCorreo(correo: string) {
  const api = await Api.getInstance("usuarios");

  return api.get<void, UsuarioResponse>({
    url: "/usuario/obtener",
    params: { correo },
  });
}

/**
 * Cambiar Contraseña (Estudiante)
 * POST /usuario/cambiar-contrasena
 */
export interface ChangePasswordResponse {
  message: string;
}

export async function changeMyPassword(payload: ChangePasswordRequest) {
  const api = await Api.getInstance("usuarios");

  return api.post<ChangePasswordRequest, ChangePasswordResponse>(payload, {
    url: "/usuario/cambiar-contrasena",
  });
}

/**
 * Listar usuarios (P.A. o Autoridad)
 * POST /usuario/listar
 * body: { limit, size, last_key }
 */
export async function listUsuarios(payload: ListUsuariosRequest) {
  const api = await Api.getInstance("usuarios");

  return api.post<ListUsuariosRequest, ListUsuariosResponse>(payload, {
    url: "/usuario/listar",
  });
}
