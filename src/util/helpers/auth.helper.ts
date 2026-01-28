import type { User } from "../../types/auth.type";

const setUser = (user: User) => localStorage.setItem("user", JSON.stringify(user));
const getUser = (): User | null => {
  const raw = localStorage.getItem("user");
  return raw ? (JSON.parse(raw) as User) : null;
};
const clearUser = () => localStorage.removeItem("user");


const setToken = (token: string) => localStorage.setItem("token", token);
const getToken = (): string | null => localStorage.getItem("token");
const clearToken = () => localStorage.removeItem("token");

export {
  setToken,
  getToken,
  clearToken,
  setUser,
  getUser,
  clearUser,
};