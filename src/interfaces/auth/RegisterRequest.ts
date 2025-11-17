import type { UserRole } from "../../types";

export interface RegisterRequest {
    nombre: string;
	correo: string;
	contrasena: string
    rol: UserRole;
}


