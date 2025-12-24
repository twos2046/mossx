import type { ApiResponse } from '../../types';

export const createResponse = <T>(
  data: T | null,
  success: boolean = true,
  error?: string,
  status: number = 200
): ApiResponse<T> => ({
  success,
  data,
  error,
  status,
});

export const methodNotAllowed = <T>(): ApiResponse<T> =>
  createResponse(null, false, 'Method Not Allowed', 405);
