import type { Request, Response } from "express";
import { apiError, apiSuccess } from "../../../lib/api/api-response.js";
import handleApiError from "../../../lib/api/handle-api-error.js";
import readSystemSettingsService from "../services/read-system-settings.service.js";

/**
 * Menangani pembacaan seluruh system setting oleh super admin.
 *
 * @param _request - Request Express untuk endpoint system settings.
 * @param response - Response Express untuk mengirim daftar system setting.
 * @returns Promise yang menghasilkan response JSON system settings.
 */
export default async function readSystemSettingsController(
  _request: Request,
  response: Response,
): Promise<Response> {
  try {
    const systemSsettings = await readSystemSettingsService();

    return apiSuccess(
      response,
      { systemSsettings },
      "System settings berhasil diambil",
    );
  } catch (error) {
    const { message, statusCode, details } = handleApiError(error);
    return apiError(response, message, statusCode, details);
  }
}
