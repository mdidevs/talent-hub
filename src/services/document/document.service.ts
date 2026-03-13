import axiosMiddleware from '@/lib/axios';
import type { ApiResponse } from '@/lib/api';
import { unwrapApiResponse } from '@/lib/api';

export type DocumentDto = {
  id: number;
  customer_id?: number | null;
  company_id?: number | null;
  name?: string | null;
  filename?: string | null;
  mime_type?: string | null;
  size_bytes?: number | null;
  createdAt?: string;
  updatedAt?: string;
  [key: string]: unknown;
};

export type ListDocumentsParams = Partial<{
  customer_id: number | string;
  company_id: number | string;
  page: number;
  limit: number;
}>;

const api = axiosMiddleware.getInstance();

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

const listDocuments = async (params?: ListDocumentsParams): Promise<DocumentDto[]> => {
  const res = await api.get<ApiResponse<DocumentDto[]>>('/documents', {
    params: normalizeQueryParams(params, { page: 1, limit: 20 }),
  });
  return unwrapApiResponse(res.data);
};

const getDocumentById = async (id: number | string): Promise<DocumentDto> => {
  const res = await api.get<ApiResponse<DocumentDto>>(`/documents/${encodeURIComponent(String(id))}`);
  return unwrapApiResponse(res.data);
};

const downloadDocument = async (id: number | string): Promise<Blob> => {
  const res = await api.get<Blob>(`/documents/${encodeURIComponent(String(id))}/download`, {
    responseType: 'blob',
  });
  return res.data;
};

export const documentService = {
  listDocuments,
  getDocumentById,
  downloadDocument,
};

