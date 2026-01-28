export type User = {
  id: string;
  name: string;
  email: string;
  role?: string; // optional (admin/user)
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