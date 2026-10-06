import type { Request, Response } from "express";
import { apiError, apiSuccess } from "../../../lib/api/api-response.js";
import handleApiError from "../../../lib/api/handle-api-error.js";
import parseAndValidateBody from "../../../lib/api/parse-and-validate-body.js";
import { createKioskSchema } from "../dto/create-kiosk.dto.js";
import createKioskService from "../services/create-kiosk.service.js";

/**
 * Menangani pembuatan kiosk baru oleh super admin.
 *
 * @param request - Request berisi data pembuatan kiosk.
 * @param response - Response Express untuk mengirim hasil pembuatan kiosk.
 * @returns Promise yang menghasilkan response JSON kiosk baru.
 */
export default async function createKioskController(
  request: Request,
  response: Response,
): Promise<Response> {
  try {
    const payload = await parseAndValidateBody(request, createKioskSchema);
    const result = await createKioskService(payload);

    return apiSuccess(response, result, "Kiosk berhasil dibuat", 201);
  } catch (error) {
    const { message, statusCode, details } = handleApiError(error);
    return apiError(response, message, statusCode, details);
  }
}
