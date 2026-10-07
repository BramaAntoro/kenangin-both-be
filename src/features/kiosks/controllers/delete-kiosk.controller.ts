import type { Request, Response } from "express";
import { apiError, apiSuccess } from "../../../lib/api/api-response.js";
import handleApiError from "../../../lib/api/handle-api-error.js";
import parseParams from "../../../lib/api/parse-params.js";
import deleteKioskService from "../services/delete-kiosk.service.js";

/**
 * Menangani request penghapusan kiosk oleh super admin.
 *
 * @param request - Request Express berisi ID kiosk pada params.
 * @param response - Response Express untuk mengirimkan hasil penghapusan kiosk.
 * @returns Promise yang menghasilkan response JSON kiosk yang telah dihapus.
 */
export default async function deleteKioskController(
  request: Request,
  response: Response,
): Promise<Response> {
  try {
    const id = parseParams(request.params.id);
    const result = await deleteKioskService(id);

    return apiSuccess(response, result, "Kiosk berhasil dihapus");
  } catch (error) {
    const { message, statusCode, details } = handleApiError(error);
    return apiError(response, message, statusCode, details);
  }
}

