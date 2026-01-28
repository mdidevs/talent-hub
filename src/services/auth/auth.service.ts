import type { AuthResponse } from "./../../types/auth.type";
import { clearToken, clearUser, getToken, getUser, setToken, setUser } from "../../util/helpers/auth.helper";
import axiosMiddleware from "../../lib/axios";

export const api = axiosMiddleware.getInstance();

// --- API calls ---
const login = async (email: string, password: string): Promise<AuthResponse> => {
  const res = await api.post<AuthResponse>("/api/auth/login", { email, password });
  const { user, token } = res.data;
  setToken(token);
  setUser(user);
  return { user, token };
};

const register = async ( name: string, email: string, password: string): Promise<AuthResponse> => {
  const res = await api.post<AuthResponse>("/api/auth/register", { name, email, password});
  const { user, token } = res.data;
  setToken(token);
  setUser(user);
  return { user, token };
};

// Optional server logout endpoint
const logout = async (): Promise<void> => {
  await api.post("/api/auth/logout");
  clearToken();
  clearUser();
};

export const authService = { login, register, logout, getToken, getUser};
