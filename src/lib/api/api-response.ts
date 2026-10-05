import type { Response } from "express";

/**
 * Standar format response API saat operasi berhasil (Sukses).
 */
export type ApiSuccessResponse<T = unknown> = {
  success: true;
  message: string;
  data: T;
  meta?: Record<string, unknown>;
};

/**
 * Helper response JSON standar untuk status Sukses
 * @param data - Payload data yang dikembalikan
 * @param message - Pesan response (default: 'Success')
 * @param statusCode - HTTP status code (default: 200)
 * @param meta - Metadata tambahan opsional (misal pagination)
 * @param response - Response Express yang digunakan untuk mengirim response.
 * @returns Object Response Express berisi payload ApiSuccessResponse dan status HTTP yang ditentukan.
 */
export function apiSuccess<T>(
  response: Response,
  data: T,
  message = "Success",
  statusCode = 200,
  meta?: Record<string, unknown>,
): Response {
  return response.status(statusCode).json({
    success: true,
    message,
    data,
    // Hanya sertakan properti meta jika disediakan.
    ...(meta ? { meta } : {}),
  } satisfies ApiSuccessResponse<T>);
}

/**
 * Standar format response API saat operasi gagal (Error).
 */
export type ApiErrorResponse = {
  success: false;
  message: string;
  error?: unknown;
};

/**
 * Helper response JSON standar untuk status Gagal / Error
 * @param message - Pesan error (default: 'Internal Server Error')
 * @param statusCode - HTTP status code (default: 400)
 * @param error - Detail error opsional (string, object, atau instance Error)
 * @param response - Response Express yang digunakan untuk mengirim response.
 * @returns Object Response Express berisi payload ApiErrorResponse dan status HTTP error yang ditentukan.
 */
export function apiError(
  response: Response,
  message = "Internal Server Error",
  statusCode = 400,
  error?: unknown,
): Response {
  return response.status(statusCode).json({
    success: false,
    message,
    // Hanya sertakan detail error jika ada.
    ...(error !== undefined
      ? { error: error instanceof Error ? error.message : error }
      : {}),
  } satisfies ApiErrorResponse);
}
