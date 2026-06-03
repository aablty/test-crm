import { apiClient } from "../../shared/apiClient";

export interface User {
  id: string;
  email: string;
}

export interface AuthResponse {
  access_token: string;
}

export async function apiFetchCurrentUser(): Promise<User> {
  const response = await apiClient.get("/auth/profile");

  return response.data as User;
}

export async function apiLogin(
  email: string,
  password: string,
): Promise<AuthResponse> {
  const response = await apiClient.post("/auth/login", { email, password });
  return response.data as AuthResponse;
}

export async function apiRegister(
  email: string,
  password: string,
): Promise<AuthResponse> {
  const response = await apiClient.post("/auth/register", { email, password });
  return response.data as AuthResponse;
}
