import axiosMiddleware from '@/lib/axios';
import type { ApiResponse } from '@/lib/api';
import { unwrapApiResponse } from '@/lib/api';

export type OfficeDto = {
  id: number;
  name: string;
  address: string;
  email: string;
  data: Record<string, unknown>;
};

export type OfficeCubicalMapDto = {
  id: number;
  office_id: number;
  floor: number;
  section: string;
  total_cubicals: number;
  used_cubicals: number;
};

const api = axiosMiddleware.getInstance();

const normalizeQueryParams = (
  params: Record<string, unknown> | undefined,
  defaults: Record<string, unknown>,
) => {
  const merged = { ...defaults, ...(params ?? {}) };
  const query: Record<string, string> = {};
  Object.entries(merged).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') {
      return;
    }
    query[key] = String(value);
  });
  return query;
};

const listOffices = async (
  params?: Partial<{ page: number; limit: number; search: string }>,
): Promise<OfficeDto[]> => {
  const res = await api.get<ApiResponse<OfficeDto[]>>('/offices', {
    params: normalizeQueryParams(params, { page: 1, limit: 20 }),
  });
  return unwrapApiResponse(res.data);
};

const listCubicalMaps = async (
  params?: Partial<{
    office_id: number;
    floor: number;
    section: string;
    page: number;
    limit: number;
  }>,
): Promise<OfficeCubicalMapDto[]> => {
  const res = await api.get<ApiResponse<OfficeCubicalMapDto[]>>(
    '/office-cubical-maps',
    {
      params: normalizeQueryParams(params, { page: 1, limit: 50 }),
    },
  );
  return unwrapApiResponse(res.data);
};

export const officeService = {
  listOffices,
  listCubicalMaps,
};
