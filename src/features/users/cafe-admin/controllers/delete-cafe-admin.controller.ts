import type { Request, Response } from "express";
import { apiError, apiSuccess } from "../../../../lib/api/api-response.js";
import handleApiError from "../../../../lib/api/handle-api-error.js";
import parseParams from "../../../../lib/api/parse-params.js";
import deleteCafeAdminService from "../services/delete-cafe-admin.service.js";

/**
 * Menangani penghapusan akun cafe admin oleh super admin.
 *
 * @param request - Request berisi ID akun cafe admin pada route parameter.
 * @param response - Response Express untuk mengirim hasil penghapusan.
 * @returns Promise yang menghasilkan response JSON akun cafe admin yang dihapus.
 */
export default async function deleteCafeAdminController(
  request: Request,
  response: Response,
): Promise<Response> {
  try {
    const id = parseParams(request.params.id);
    const deletedCafeAdmin = await deleteCafeAdminService(id);

    return apiSuccess(
      response,
      { cafeAdmin: deletedCafeAdmin },
      "Akun cafe admin berhasil dihapus",
    );
  } catch (error) {
    const { message, statusCode, details } = handleApiError(error);
    return apiError(response, message, statusCode, details);
  }
}
