import type { Request, Response } from "express";
import { apiError, apiSuccess } from "../../../lib/api/api-response.js";
import handleApiError from "../../../lib/api/handle-api-error.js";
import parseAndValidateBody from "../../../lib/api/parse-and-validate-body.js";
import { createCafeSchema } from "../dto/create-cafe.dto.js";
import createCafeService from "../services/create-cafe.service.js";

/**
 * Menangani pembuatan cafe beserta relasinya dengan cafe admin.
 *
 * @param request - Request berisi data cafe dan ID cafe admin.
 * @param response - Response Express untuk mengirim hasil pembuatan cafe.
 * @returns Promise yang menghasilkan response JSON cafe baru.
 */
export default async function createCafeController(
  request: Request,
  response: Response,
): Promise<Response> {
  try {
    const payload = await parseAndValidateBody(request, createCafeSchema);
    const result = await createCafeService(payload);

    return apiSuccess(response, result, "Cafe berhasil dibuat", 201);
  } catch (error) {
    const { message, statusCode, details } = handleApiError(error);
    return apiError(response, message, statusCode, details);
  }
}
