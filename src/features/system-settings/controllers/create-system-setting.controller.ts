import type { Request, Response } from "express";
import { apiError, apiSuccess } from "../../../lib/api/api-response.js";
import handleApiError from "../../../lib/api/handle-api-error.js";
import parseAndValidateBody from "../../../lib/api/parse-and-validate-body.js";
import { createSystemSettingSchema } from "../dto/create-system-setting.dto.js";
import createSystemSettingService from "../services/create-system-setting.service.js";

/**
 * Menangani pembuatan system setting global oleh super admin.
 *
 * @param request - Request berisi setting key, value, dan description.
 * @param response - Response Express untuk mengirim hasil pembuatan setting.
 * @returns Promise yang menghasilkan response JSON system setting.
 */
export default async function createSystemSettingController(
  request: Request,
  response: Response,
): Promise<Response> {
  try {
    const payload = await parseAndValidateBody(
      request,
      createSystemSettingSchema,
    );
    const setting = await createSystemSettingService(payload, request.user!.id);

    return apiSuccess(response, { setting }, "System setting berhasil dibuat", 201);
  } catch (error) {
    const { message, statusCode, details } = handleApiError(error);
    return apiError(response, message, statusCode, details);
  }
}
