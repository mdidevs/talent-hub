import axiosMiddleware from '@/lib/axios';
import type { ApiResponse } from '@/lib/api';
import { unwrapApiResponse } from '@/lib/api';

export type PricingPlan = {
  id: number | string;
  name: string;
  label: string;
  description?: string | null;
  billing_cycle?: string | null;
  price: number;
  data?: Record<string, unknown> | null;
};

const api = axiosMiddleware.getInstance();

const listPlans = async (activeOnly = true): Promise<PricingPlan[]> => {
  const res = await api.get<ApiResponse<PricingPlan[]>>('/pricing/all', {
    params: { activeOnly },
  });

  return unwrapApiResponse(res.data);
};

export const pricingService = {
  listPlans,
};
