import type { Request, Response } from "express";
import { apiError, apiSuccess } from "../../../../lib/api/api-response.js";
import handleApiError from "../../../../lib/api/handle-api-error.js";
import AppError from "../../../../lib/app-error.js";
import readSessionService from "../services/read-session.service.js";

/**
 * Mengambil informasi sesi berdasarkan session code.
 *
 * @param request - Request Express yang membawa session code pada URL.
 * @param response - Response Express untuk mengirim data sesi atau error.
 * @returns Response API berisi informasi sesi.
 */
export default async function readSessionController(
  request: Request,
  response: Response,
): Promise<Response> {
  try {
    const sessionCode = request.params.sessionCode;
    if (typeof sessionCode !== "string" || !/^[\w-]+$/.test(sessionCode)) {
      throw new AppError("sessionCode tidak valid", 400);
    }

    const session = await readSessionService(sessionCode);

    return apiSuccess(response, { session }, "Session berhasil diambil");
  } catch (error) {
    const { message, statusCode, details } = handleApiError(error);
    return apiError(response, message, statusCode, details);
  }
}
