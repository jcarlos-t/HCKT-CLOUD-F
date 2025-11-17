import type { LoginRequest } from "../../interfaces/auth/LoginRequest";
import type { AuthResponse } from "../../interfaces/auth/AuthResponse";
import Api from "../api";

export async function login(loginRequest: LoginRequest) {
  const api = await Api.getInstance("usuarios");

  const response = await api.post<LoginRequest, AuthResponse>(loginRequest, {
    url: "/usuario/login",
  });

  // Guardamos el token en la instancia de Api (se sincroniza automáticamente)
  api.authorization = response.data.token;

  // Devolvemos todo el response para que el AuthContext use data.usuario, data.token
  return response;
}
