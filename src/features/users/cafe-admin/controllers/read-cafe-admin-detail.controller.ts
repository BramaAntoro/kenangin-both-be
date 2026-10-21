import type { Request, Response } from "express";
import { apiError, apiSuccess } from "../../../../lib/api/api-response.js";
import handleApiError from "../../../../lib/api/handle-api-error.js";
import parseParams from "../../../../lib/api/parse-params.js";
import readCafeAdminDetailService from "../services/read-cafe-admin-detail.service.js";

export default async function readCafeAdminDetailController(
  request: Request,
  response: Response,
): Promise<Response> {
  try {
    const cafes = await readCafeAdminDetailService(parseParams(request.params.id));
    return apiSuccess(response, { cafes }, "Daftar cafe admin berhasil diambil");
  } catch (error) {
    const { message, statusCode, details } = handleApiError(error);
    return apiError(response, message, statusCode, details);
  }
}
