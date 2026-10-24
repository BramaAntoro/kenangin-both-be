import type { Request, Response } from "express";
import { apiError, apiSuccess } from "../../../../lib/api/api-response.js";
import handleApiError from "../../../../lib/api/handle-api-error.js";
import parseParams from "../../../../lib/api/parse-params.js";
import { readCafeBoothPackagesService } from "../services/read-booth-package.service.js";

export default async function readCafeBoothPackagesController(
  request: Request,
  response: Response,
): Promise<Response> {
  try {
    const cafeId = parseParams(request.params.cafeId);
    const page = Math.max(Number(request.query.page) || 1, 1);
    const limit = Math.min(Math.max(Number(request.query.limit) || 5, 1), 50);
    const result = await readCafeBoothPackagesService(
      request.user!,
      cafeId,
      { page, limit },
    );

    return apiSuccess(
      response,
      { cafe: result.cafe },
      "Daftar paket booth berhasil diambil",
      200,
      result.meta,
    );
  } catch (error) {
    const { message, statusCode, details } = handleApiError(error);
    return apiError(response, message, statusCode, details);
  }
}