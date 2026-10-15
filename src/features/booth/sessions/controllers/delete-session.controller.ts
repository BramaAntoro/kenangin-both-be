import type { Request, Response } from "express";
import { apiError, apiSuccess } from "../../../../lib/api/api-response.js";
import handleApiError from "../../../../lib/api/handle-api-error.js";
import AppError from "../../../../lib/app-error.js";
import deleteSessionService from "../services/delete-session.service.js";

/**
 * Menangani penghapusan sesi berdasarkan session code.
 *
 * @param request - Request Express yang membawa session code pada URL.
 * @param response - Response Express untuk mengirim hasil penghapusan.
 * @returns Response API berisi sesi yang telah dihapus.
 */
export default async function deleteSessionController(
  request: Request,
  response: Response,
): Promise<Response> {
  try {
    const sessionCode = request.params.sessionCode;
    if (typeof sessionCode !== "string" || !/^[\w-]+$/.test(sessionCode)) {
      throw new AppError("sessionCode tidak valid", 400);
    }

    const session = await deleteSessionService(sessionCode);
    return apiSuccess(response, { session }, "Session berhasil dihapus");
  } catch (error) {
    const { message, statusCode, details } = handleApiError(error);
    return apiError(response, message, statusCode, details);
  }
}
