import type { AuthResponse } from "./../../types/auth.type";
import { clearToken, clearUser, getToken, getUser, setToken, setUser } from "../../util/helpers/auth.helper";
import axiosMiddleware from "../../lib/axios";
import type { ApiResponse } from "@/lib/api";
import { unwrapApiResponse } from "@/lib/api";

export const api = axiosMiddleware.getInstance();

// --- API calls ---
const login = async (email: string, password: string): Promise<AuthResponse> => {
  const res = await api.post<ApiResponse<AuthResponse>>("/auth/login", { email, password });
  const payload = unwrapApiResponse(res.data);
  setToken(payload.token);
  setUser(payload.user);
  return payload;
};

const register = async (name: string, email: string, password: string): Promise<AuthResponse> => {
  const res = await api.post<ApiResponse<AuthResponse>>("/auth/register", { name, email, password });
  const payload = unwrapApiResponse(res.data);
  setToken(payload.token);
  setUser(payload.user);
  return payload;
};

// Client-only logout because backend route is not implemented
const logout = async (): Promise<void> => {
  clearToken();
  clearUser();
};

export const authService = { login, register, logout, getToken, getUser };
