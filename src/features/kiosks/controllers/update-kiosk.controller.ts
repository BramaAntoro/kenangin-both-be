import type { Request, Response } from "express";
import { apiError, apiSuccess } from "../../../lib/api/api-response.js";
import handleApiError from "../../../lib/api/handle-api-error.js";
import parseAndValidateBody from "../../../lib/api/parse-and-validate-body.js";
import parseParams from "../../../lib/api/parse-params.js";
import { updateKioskSchema } from "../dto/update-kiosk.dto.js";
import updateKioskService from "../services/update-kiosk.service.js";

/**
 * Menangani request pembaruan data kiosk oleh super admin.
 *
 * @param request - Request Express berisi ID kiosk pada params dan data update pada body.
 * @param response - Response Express untuk mengirimkan hasil pembaruan kiosk.
 * @returns Promise yang menghasilkan response JSON kiosk yang telah diperbarui.
 */
export default async function updateKioskController(
  request: Request,
  response: Response,
): Promise<Response> {
  try {
    const id = parseParams(request.params.id);
    const payload = await parseAndValidateBody(request, updateKioskSchema);
    const result = await updateKioskService(id, payload);

    return apiSuccess(response, result, "Kiosk berhasil diperbarui");
  } catch (error) {
    const { message, statusCode, details } = handleApiError(error);
    return apiError(response, message, statusCode, details);
  }
}
