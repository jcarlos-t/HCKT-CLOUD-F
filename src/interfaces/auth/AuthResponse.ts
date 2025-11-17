import type {UserRole} from "../../types/index";

export interface AuthResponse {
  message: string;
  token: string;
  usuario: Usuario;
}

export interface Usuario {
  correo: string;
  nombre: string;
  rol: UserRole;
}
