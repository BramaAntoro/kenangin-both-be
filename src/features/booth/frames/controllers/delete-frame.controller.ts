import type { Request, Response } from "express";
import { apiError, apiSuccess } from "../../../../lib/api/api-response.js";
import handleApiError from "../../../../lib/api/handle-api-error.js";
import parseParams from "../../../../lib/api/parse-params.js";
import deleteFrameService from "../services/delete-frame.service.js";

/**
 * Menangani request untuk menonaktifkan frame.
 *
 * @param request - Request Express berisi ID frame dan user dari JWT.
 * @param response - Response Express untuk mengirim hasil atau error.
 * @returns Response JSON berisi frame yang dinonaktifkan atau detail error.
 */
export default async function deleteFrameController(
  request: Request,
  response: Response,
): Promise<Response> {
  try {
    const frameId = parseParams(request.params.id);
    const { id: userId, role } = request.user!;
    const frame = await deleteFrameService(frameId, userId, role);

    return apiSuccess(response, { frame }, "Frame berhasil dinonaktifkan");
  } catch (error) {
    const { message, statusCode, details } = handleApiError(error);
    return apiError(response, message, statusCode, details);
  }
}
