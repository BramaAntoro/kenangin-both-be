import type { Request, Response } from "express";
import { apiError, apiSuccess } from "../../../../lib/api/api-response.js";
import parseAndValidateBody from "../../../../lib/api/parse-and-validate-body.js";
import parseParams from "../../../../lib/api/parse-params.js";
import handleApiError from "../../../../lib/api/handle-api-error.js";
import { updateBoothPackageSchema } from "../dto/update-booth-package.dto.js";
import updateBoothPackageService from "../services/update-booth-package.service.js";

/**
 * Menangani pembaruan paket booth milik cafe admin yang sedang login.
 *
 * ID paket diperoleh dari parameter route dan ID admin dari JWT. Service akan
 * memastikan paket tersebut berada pada cafe yang dikelola oleh admin.
 *
 * @param request - Request Express yang berisi ID paket, JWT, dan body update.
 * @param response - Response Express untuk mengirim hasil pembaruan.
 * @returns Response JSON berisi paket terbaru atau detail error.
 */
export default async function updateBoothPackageController(
  request: Request,
  response: Response,
): Promise<Response> {
  try {
    const packageId = parseParams(request.params.id);
    const userId = request.user!.id;

    const validatedData = await parseAndValidateBody(
      request,
      updateBoothPackageSchema,
    );

    const result = await updateBoothPackageService(
      packageId,
      userId,
      validatedData,
    );

    return apiSuccess(
      response,
      { package: result },
      "Paket booth berhasil diperbarui",
    );
  } catch (error) {
    const { message, statusCode, details } = handleApiError(error);
    return apiError(response, message, statusCode, details);
  }
}
