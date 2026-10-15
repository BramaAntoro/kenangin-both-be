import type { Request, Response } from "express";
import { apiError, apiSuccess } from "../../../lib/api/api-response.js";
import handleApiError from "../../../lib/api/handle-api-error.js";
import parseAndValidateBody from "../../../lib/api/parse-and-validate-body.js";
import parseParams from "../../../lib/api/parse-params.js";
import { updateSystemSettingSchema } from "../dto/update-system-setting.dto.js";
import updateSystemSettingService from "../services/update-system-setting.service.js";

/**
 * Menangani pembaruan system setting oleh super admin.
 *
 * @param request - Request berisi ID pada parameter dan data perubahan pada body.
 * @param response - Response Express untuk mengirim hasil pembaruan.
 * @returns Promise yang menghasilkan response JSON system setting.
 */
export default async function updateSystemSettingController(
  request: Request,
  response: Response,
): Promise<Response> {
  try {
    const id = parseParams(request.params.id);
    const payload = await parseAndValidateBody(
      request,
      updateSystemSettingSchema,
    );
    const userId = request.user!.id
    const setting = await updateSystemSettingService(
      id,
      payload,
      userId
    );

    return apiSuccess(response, { setting }, "System setting berhasil diperbarui");
  } catch (error) {
    const { message, statusCode, details } = handleApiError(error);
    return apiError(response, message, statusCode, details);
  }
}
