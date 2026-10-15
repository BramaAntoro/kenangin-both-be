import type { Request, Response } from "express";
import { apiError, apiSuccess } from "../../../../lib/api/api-response.js";
import handleApiError from "../../../../lib/api/handle-api-error.js";
import clearCookies from "../../../../lib/jwt/clear-cookies.js";

/**
 * Menangani proses logout user dengan menghapus cookie JWT autentikasi.
 *
 * @param _request - Request Express untuk endpoint logout.
 * @param response - Response Express untuk menghapus cookie dan mengirim hasil.
 * @returns Promise yang menghasilkan response JSON logout.
 */
export default async function logoutController(
  _request: Request,
  response: Response,
): Promise<Response> {
  try {
    clearCookies(response);

    return apiSuccess(response, null, "Logout berhasil", 200);
  } catch (error) {
    const { message, statusCode, details } = handleApiError(error);
    return apiError(response, message, statusCode, details);
  }
}
