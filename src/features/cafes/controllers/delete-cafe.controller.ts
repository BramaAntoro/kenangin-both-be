import type { Request, Response } from "express";
import { apiError, apiSuccess } from "../../../lib/api/api-response.js";
import handleApiError from "../../../lib/api/handle-api-error.js";
import parseParams from "../../../lib/api/parse-params.js";
import deleteCafeService from "../services/delete-cafe.service.js";

/**
 * Menangani penghapusan cafe oleh super admin.
 *
 * @param request - Request berisi ID cafe pada route parameter.
 * @param response - Response Express untuk mengirim hasil penghapusan.
 * @returns Promise yang menghasilkan response JSON cafe yang dihapus.
 */
export default async function deleteCafeController(
  request: Request,
  response: Response,
): Promise<Response> {
  try {
    const id = parseParams(request.params.id);
    const deletedCafe = await deleteCafeService(id);

    return apiSuccess(
      response,
      { cafe: deletedCafe },
      "Cafe berhasil dihapus",
    );
  } catch (error) {
    const { message, statusCode, details } = handleApiError(error);
    return apiError(response, message, statusCode, details);
  }
}
