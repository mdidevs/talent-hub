import axiosMiddleware from '@/lib/axios';
import type { ApiResponse } from '@/lib/api';
import { unwrapApiResponse } from '@/lib/api';

export type PaginationMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type MarketCategoryDto = {
  id: number;
  market_id: number;
  parent_id: number | null;
  name: string;
  label: string;
  description?: string | null;
};

export type PricePlanDto = {
  id: number;
  name: string;
  label: string;
  description?: string | null;
  billing_cycle: string;
  price: number;
  data?: Record<string, unknown> | null;
};

export type MarketItemPlanDto = {
  id: number;
  uuid: string;
  market_item_id: number;
  price_plan_id: number;
  status: string;
  comment: string | null;
  pricePlan: PricePlanDto;
};

export type MarketItemDto = {
  id: number;
  market_category_id: number;
  uuid: string;
  name: string;
  description?: string | null;
  itemPlans: MarketItemPlanDto[];
};

const api = axiosMiddleware.getInstance();

const normalizeQueryParams = (
  params: Record<string, unknown> | undefined,
  defaults: Record<string, unknown>,
) => {
  const merged = { ...defaults, ...(params ?? {}) };
  const query: Record<string, string> = {};
  Object.entries(merged).forEach(([key, value]) => {
    if (value === undefined || value === null) {
      return;
    }
    query[key] = String(value);
  });
  return query;
};

const listCategories = async (
  params?: Partial<{ page: number; limit: number; search: string; market_id: number; parent_id: number | null }>,
): Promise<MarketCategoryDto[]> => {
  const res = await api.get<ApiResponse<MarketCategoryDto[]>>(
    '/market/category/all',
    {
      params: normalizeQueryParams(params, { page: 1, limit: 50 }),
    },
  );
  return unwrapApiResponse(res.data);
};

const listItems = async (
  params?: Partial<{ page: number; limit: number; search: string; market_id: number; market_category_id: number }>,
): Promise<MarketItemDto[]> => {
  const res = await api.get<ApiResponse<MarketItemDto[]>>(
    '/market/item/all',
    {
      params: normalizeQueryParams(params, { page: 1, limit: 50 }),
    },
  );
  return unwrapApiResponse(res.data);
};

export const marketService = {
  listCategories,
  listItems,
};
