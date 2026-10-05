import type { Request, Response } from "express";
import { apiError, apiSuccess } from "../../../lib/api/api-response.js";
import handleApiError from "../../../lib/api/handle-api-error.js";
import parseParams from "../../../lib/api/parse-params.js";
import deleteSystemSettingService from "../services/delete-system-setting.service.js";

/**
 * Menangani penghapusan system setting oleh super admin.
 *
 * @param request - Request berisi ID system setting pada route parameter.
 * @param response - Response Express untuk mengirim hasil penghapusan.
 * @returns Promise yang menghasilkan response JSON penghapusan setting.
 */
export default async function deleteSystemSettingController(
  request: Request,
  response: Response,
): Promise<Response> {
  try {
    const id = parseParams(request.params.id);
    const deletedSetting = await deleteSystemSettingService(id);

    return apiSuccess(
      response,
      { setting: deletedSetting },
      "System setting berhasil dihapus",
    );
  } catch (error) {
    const { message, statusCode, details } = handleApiError(error);
    return apiError(response, message, statusCode, details);
  }
}
