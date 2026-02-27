export type ApiResponse<T> = {
  success: boolean;
  message?: string;
  data?: T;
  meta?: {
    timestamp: string;
    path: string;
  };
};

export function unwrapApiResponse<T>(payload: ApiResponse<T>): T {
  if (!payload || payload.success !== true) {
    throw new Error(payload?.message || 'Request failed');
  }

  if (payload.data === undefined || payload.data === null) {
    throw new Error('Response payload missing data field');
  }

  return payload.data;
}
