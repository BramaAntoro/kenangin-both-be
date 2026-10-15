import type { Request, Response } from "express";
import { apiError, apiSuccess } from "../../../../lib/api/api-response.js";
import handleApiError from "../../../../lib/api/handle-api-error.js";
import parseAndValidateBody from "../../../../lib/api/parse-and-validate-body.js";
import { createBoothPackageSchema } from "../dto/create-booth-package.dto.js";
import createBoothPackageService from "../services/create-booth-package.service.js";

/**
 * Menangani pembuatan paket booth baru oleh cafe admin.
 *
 * Mengambil `cafe_id` secara otomatis dari JWT token (`request.user.id`)
 * sehingga cafe admin hanya bisa membuat paket untuk cafenya sendiri.
 *
 * @param request - Request berisi data paket booth.
 * @param response - Response Express untuk mengirim hasil pembuatan paket.
 * @returns Promise yang menghasilkan response JSON paket booth baru.
 */
export default async function createBoothPackageController(
  request: Request,
  response: Response,
): Promise<Response> {
  try {
    const userId = request.user!.id;

    const payload = await parseAndValidateBody(
      request,
      createBoothPackageSchema,
    );

    const result = await createBoothPackageService(userId, payload);

    return apiSuccess(
      response,
      { package: result },
      "Paket kenangin booth berhasil dibuat",
      201,
    );
  } catch (error) {
    const { message, statusCode, details } = handleApiError(error);
    return apiError(response, message, statusCode, details);
  }
}
