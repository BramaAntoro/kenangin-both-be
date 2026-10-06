import type { Request, Response } from "express";
import { apiError, apiSuccess } from "../../../lib/api/api-response.js";
import handleApiError from "../../../lib/api/handle-api-error.js";
import parseAndValidateBody from "../../../lib/api/parse-and-validate-body.js";
import parseParams from "../../../lib/api/parse-params.js";
import { updateCafeSchema } from "../dto/update-cafe.dto.js";
import updateCafeService from "../services/update-cafe.service.js";

/**
 * Menangani pembaruan data cafe oleh super admin.
 *
 * @param request - Request berisi ID cafe pada parameter dan data perubahan pada body.
 * @param response - Response Express untuk mengirim hasil pembaruan cafe.
 * @returns Promise yang menghasilkan response JSON cafe yang diperbarui.
 */
export default async function updateCafeController(
  request: Request,
  response: Response,
): Promise<Response> {
  try {
    const id = parseParams(request.params.id);
    const payload = await parseAndValidateBody(request, updateCafeSchema);
    const cafe = await updateCafeService(id, payload);

    return apiSuccess(response, { cafe }, "Cafe berhasil diperbarui");
  } catch (error) {
    const { message, statusCode, details } = handleApiError(error);
    return apiError(response, message, statusCode, details);
  }
}
