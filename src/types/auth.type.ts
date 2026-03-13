export type Company = {
  id?: number | string;
  name?: string | null;
  address?: string | null;
  category?: string | null;
  // allow additional backend fields without breaking the UI
  [key: string]: unknown;
};

export type CustomerCompany = {
  id?: number | string;
  customer_job_title?: string | null;
  customer_work_email?: string | null;
  customer_work_phone?: string | null;
  company?: Company | null;
  [key: string]: unknown;
};

export type Customer = {
  id?: number | string;
  first_name?: string | null;
  last_name?: string | null;
  phone?: string | null;
  companies?: CustomerCompany[] | null;
  [key: string]: unknown;
};

export type User = {
  id: string;
  name?: string;
  email: string;
  role?: string; // optional (admin/user)

  // /auth/me enrichments
  first_name?: string | null;
  last_name?: string | null;
  phone?: string | null;
  customer_id?: number | null;
  customer?: Customer | null;
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