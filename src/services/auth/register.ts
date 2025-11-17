import type { RegisterRequest } from "../../interfaces/auth/RegisterRequest";
import type { AuthResponse } from "../../interfaces/auth/AuthResponse";
import Api from "../api";

export async function register(registerRequest: RegisterRequest) {
  const api = await Api.getInstance("usuarios");

  const response = await api.post<RegisterRequest, AuthResponse>(
    registerRequest,
    {
      url: "/usuario/crear",
    },
  );

  api.authorization = response.data.token;

  return response;
}
