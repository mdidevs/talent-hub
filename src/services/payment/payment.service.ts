import axiosMiddleware from '@/lib/axios';

export type CreatePaymentIntentPayload = {
  amount?: number;
  currency?: string;
  orderId?: number;
  receiptEmail?: string;
  description?: string;
};

export type PaymentIntentResponse = {
  clientSecret: string;
  intentId: string;
  amount: number;
  currency: string;
  status: string;
};

const apiClient = axiosMiddleware.getInstance();

const createPaymentIntent = async (payload: CreatePaymentIntentPayload): Promise<PaymentIntentResponse> => {
  const response = await apiClient.post('/payments/intent', payload, {
    headers: { 'Content-Type': 'application/json' },
  });

  const body = response?.data ?? response;
  if (body && typeof body === 'object' && 'data' in body) {
    const nested = (body as { data?: PaymentIntentResponse }).data;
    if (nested && typeof nested === 'object') return nested;
  }

  return body as PaymentIntentResponse;
};

export const paymentService = {
  createPaymentIntent,
};
