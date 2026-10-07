import type { Request, Response } from "express";
import handleApiError from "../../../../lib/api/handle-api-error.js";
import { apiError, apiSuccess } from "../../../../lib/api/api-response.js";
import readBoothPackageService from "../services/read-booth-package.service.js";

/**
 * Mengambil daftar paket booth sesuai cakupan akses user yang login.
 *
 * Super admin menerima paket dari seluruh cafe, sedangkan cafe admin hanya
 * menerima paket dari cafe yang terhubung dengan akunnya..
 *
 * @param request - Request Express yang telah diautentikasi dan memiliki
 *   payload user pada `request.user`.
 * @param response - Response Express untuk mengirim data paket atau error.
 * @returns Response Express berisi daftar paket booth atau detail error.
 */
export default async function readBoothPackageController(
  request: Request,
  response: Response,
): Promise<Response> {
  try {
    const result = await readBoothPackageService(request.user!);

    return apiSuccess(
      response,
      { cafes: result },
      "Daftar paket booth berhasil diambil",
    );
  } catch (error) {
    const { message, statusCode, details } = handleApiError(error);
    return apiError(response, message, statusCode, details);
  }
}
