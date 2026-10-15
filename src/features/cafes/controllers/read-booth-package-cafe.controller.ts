import type { Request, Response } from "express";
import handleApiError from "../../../lib/api/handle-api-error.js";
import { apiError, apiSuccess } from "../../../lib/api/api-response.js";
import parseParams from "../../../lib/api/parse-params.js";
import readBoothPackageCafeService from "./read-booth-package-cafe.service.js";

/**
 * Mengambil paket booth milik satu cafe setelah memeriksa akses user.
 *
 * @param request - Request Express berisi ID cafe dan user dari JWT.
 * @param response - Response Express untuk mengirim daftar paket atau error.
 * @returns Response JSON berisi cafe beserta paket booth-nya.
 */
export default async function readBoothPackageCafeController(
  request: Request,
  response: Response,
): Promise<Response> {
  try {
    const cafeId = parseParams(request.params.cafeId);
    const result = await readBoothPackageCafeService(cafeId, request.user!);

    return apiSuccess(
      response,
      { cafe: result },
      "Daftar paket booth cafe berhasil diambil",
    );
  } catch (error) {
    const { message, statusCode, details } = handleApiError(error);
    return apiError(response, message, statusCode, details);
  }
}
