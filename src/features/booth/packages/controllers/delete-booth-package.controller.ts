import type { Request, Response } from "express";
import { apiError, apiSuccess } from "../../../../lib/api/api-response.js";
import handleApiError from "../../../../lib/api/handle-api-error.js";
import parseParams from "../../../../lib/api/parse-params.js";
import deleteBoothPackageService from "../services/delete-booth-package.service.js";

/**
 * Menangani request untuk menghapus permanen paket booth.
 *
 * @param request - Request Express berisi ID paket dan user dari JWT.
 * @param response - Response Express untuk mengirimkan hasil operasi.
 * @returns Response JSON berisi paket yang dinonaktifkan atau detail error.
 */
export default async function deleteBoothPackageController(
  request: Request,
  response: Response,
): Promise<Response> {
  try {
    const packageId = parseParams(request.params.id);
    const result = await deleteBoothPackageService(packageId, request.user!.id);

    return apiSuccess(response, { package: result }, "Paket booth berhasil dihapus");
  } catch (error) {
    const { message, statusCode, details } = handleApiError(error);
    return apiError(response, message, statusCode, details);
  }
}
