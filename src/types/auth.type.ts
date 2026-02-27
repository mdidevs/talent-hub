export type User = {
  id: string;
  name: string;
  email: string;
  role?: string; // optional (admin/user)
  customer_id?: number | null;
};

export type AuthResponse = {
  user: User;
  token: string;
};

export type AuthState = {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;

  isLoading: boolean;
  error: string | null;
};

export type RegisterPayload = {
  name: string;
  email: string;
  password: string;
};

export type LoginPayload = {
  email: string;
  password: string;
};

export type ResetPayload = {
  email: string;
};

export type NewPasswordPayload = {
  token?: string;
  password: string;
};