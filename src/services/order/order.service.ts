import axiosMiddleware from '@/lib/axios';
import type { ApiResponse } from '@/lib/api';
import { unwrapApiResponse } from '@/lib/api';

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
};

export type OrderDto = {
  id: number;
  customer_id: number;
  total_amount: number;
  status: string;
  currency: string;
  order_items: OrderItemDto[];
};

const apiClient = axiosMiddleware.getInstance();

const createOrder = async (payload: CreateOrderPayload): Promise<OrderDto> => {
  const response = await apiClient.post<ApiResponse<OrderDto>>('/orders', payload, {
    headers: { 'Content-Type': 'application/json' },
  });

  return unwrapApiResponse(response.data);
};

export const orderService = {
  createOrder,
};
