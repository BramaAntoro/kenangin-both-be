import type { Request, Response } from "express";
import handleApiError from "../../../lib/api/handle-api-error.js";
import { apiError, apiSuccess } from "../../../lib/api/api-response.js";
import readDetailSystemSettingService from "../services/read-detail-system-setting.service.js";
import parseParams from "../../../lib/api/parse-params.js";

export default async function readDetailSystemSettingController(
  request: Request,
  response: Response,
): Promise<Response> {
  try {
    const id = parseParams(request.params.id);

    const systemSetting = await readDetailSystemSettingService(id);

    return apiSuccess(
      response,
      { systemSetting },
      `Detail system setting ${id}`,
    );
  } catch (error) {
    const { message, statusCode, details } = handleApiError(error);
    return apiError(response, message, statusCode, details);
  }
}
