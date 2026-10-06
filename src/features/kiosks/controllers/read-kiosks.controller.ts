import type { Request, Response } from "express";
import { apiError, apiSuccess } from "../../../lib/api/api-response.js";
import handleApiError from "../../../lib/api/handle-api-error.js";
import AppError from "../../../lib/app-error.js";
import readKiosksService from "../services/read-kiosks.service.js";

/**
 * Menangani pengambilan data kiosk yang dikelompokkan berdasarkan nama cafe.
 *
 * @param request - Request Express yang sudah diautentikasi (memiliki request.user).
 * @param response - Response Express untuk mengirim hasil query kiosk.
 * @returns Promise yang menghasilkan response JSON berisi list kiosk.
 */
export default async function readKiosksController(
  request: Request,
  response: Response,
): Promise<Response> {
  try {

    const result = await readKiosksService(request.user!);

    return apiSuccess(response, result, "Daftar kiosk berhasil diambil");
  } catch (error) {
    const { message, statusCode, details } = handleApiError(error);
    return apiError(response, message, statusCode, details);
  }
}
