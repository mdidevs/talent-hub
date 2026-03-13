import axiosMiddleware from '@/lib/axios';
import type { ApiResponse } from '@/lib/api';
import { unwrapApiResponse } from '@/lib/api';

export type PaginationMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type CreateOrderItemPayload = {
  market_item_plan_id: number;
  quantity?: number;
  unit_price?: number;
};

export type CreateOrderPayload = {
  currency?: string;
  items: CreateOrderItemPayload[];
  customer_id?: number;
};

export type OrderItemDto = {
  id: number;
  order_id: number;
  market_item_plan_id: number;
  quantity: number;
  unit_price: number;
  total_price: number;
  market_item_plan?: {
    id: number;
    uuid?: string;
    status?: string;
    comment?: string | null;
    pricePlan?: {
      id: number;
      name?: string;
      label?: string;
      billing_cycle?: string;
      price?: number;
      [key: string]: unknown;
    };
    marketItem?: {
      id: number;
      name?: string;
      description?: string | null;
      [key: string]: unknown;
    };
    [key: string]: unknown;
  };
};

export type CustomerDto = {
  id: number;
  name?: string | null;
  email?: string | null;
  company_name?: string | null;
  [key: string]: unknown;
};

export type TransactionDto = {
  id: number;
  order_id: number;
  amount: number;
  currency: string;
  payment_method?: string | null;
  payment_status?: string | null;
  transaction_id?: string | null;
  transaction_data?: Record<string, unknown> | null;
  createdAt?: string;
  updatedAt?: string;
  [key: string]: unknown;
};

export type OrderDto = {
  id: number;
  customer_id: number;
  total_amount: number;
  status: string;
  currency: string;
  order_items: OrderItemDto[];
  customer?: CustomerDto;
  transactions?: TransactionDto[];
  createdAt?: string;
  updatedAt?: string;
  [key: string]: unknown;
};

const apiClient = axiosMiddleware.getInstance();

const normalizeQueryParams = (
  params: Record<string, unknown> | undefined,
  defaults: Record<string, unknown>,
) => {
  const merged = { ...defaults, ...(params ?? {}) };
  const query: Record<string, string> = {};
  Object.entries(merged).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') return;
    query[key] = String(value);
  });
  return query;
};

export type ListOrdersParams = Partial<{
  page: number;
  limit: number;
  customer_id: number | string;
  status: string;
}>;

const listOrders = async (params?: ListOrdersParams): Promise<OrderDto[]> => {
  const response = await apiClient.get<ApiResponse<OrderDto[]>>('/orders', {
    // Don't force pagination defaults; let API apply defaults if omitted.
    params: normalizeQueryParams(params, {}),
  });

  return unwrapApiResponse(response.data);
};

const getOrderById = async (id: number | string): Promise<OrderDto> => {
  const response = await apiClient.get<ApiResponse<OrderDto>>(`/orders/${encodeURIComponent(String(id))}`);
  return unwrapApiResponse(response.data);
};

const createOrder = async (payload: CreateOrderPayload): Promise<OrderDto> => {
  const response = await apiClient.post<ApiResponse<OrderDto>>('/orders', payload, {
    headers: { 'Content-Type': 'application/json' },
  });

  return unwrapApiResponse(response.data);
};

export const orderService = {
  listOrders,
  getOrderById,
  createOrder,
};
