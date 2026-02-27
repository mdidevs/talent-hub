import axiosMiddleware from '@/lib/axios';
import type { ApiResponse } from '@/lib/api';
import { unwrapApiResponse } from '@/lib/api';

export type CreateTransactionPayload = {
  order_id: number;
  amount: number;
  currency: string;
  payment_method: string;
  payment_status: string;
  transaction_id: string;
  transaction_data: Record<string, unknown>;
};

export type TransactionDto = {
  id: number;
  order_id: number;
  amount: number;
  currency: string;
  payment_method: string;
  payment_status: string;
  transaction_id: string | null;
  transaction_data: Record<string, unknown> | null;
  createdAt: string;
  updatedAt: string;
};

const apiClient = axiosMiddleware.getInstance();

const createTransaction = async (
  payload: CreateTransactionPayload,
): Promise<TransactionDto> => {
  const response = await apiClient.post<ApiResponse<TransactionDto>>(
    '/transactions',
    payload,
    { headers: { 'Content-Type': 'application/json' } },
  );

  return unwrapApiResponse(response.data);
};

export const transactionService = {
  createTransaction,
};
