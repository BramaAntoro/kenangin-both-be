import type { Request, Response } from "express";
import { apiError, apiSuccess } from "../../../../lib/api/api-response.js";
import handleApiError from "../../../../lib/api/handle-api-error.js";
import parseAndValidateBody from "../../../../lib/api/parse-and-validate-body.js";
import { createCafeAdminSchema } from "../dto/create-cafe-admin.dto.js";
import createCafeAdminService from "../services/create-cafe-admin.service.js";

/**
 * Menangani pembuatan akun cafe admin oleh super admin.
 *
 * @param request - Request Express berisi email, nama, dan password akun baru.
 * @param response - Response Express untuk mengirim hasil pembuatan akun.
 * @returns Promise yang menghasilkan response JSON pembuatan akun.
 */
export default async function createCafeAdminController(
  request: Request,
  response: Response,
): Promise<Response> {
  try {
    const validatedData = await parseAndValidateBody(
      request,
      createCafeAdminSchema,
    );
    const result = await createCafeAdminService(validatedData);

    return apiSuccess(response, { user: result.user }, result.message, 201);
  } catch (error) {
    const { message, statusCode, details } = handleApiError(error);
    return apiError(response, message, statusCode, details);
  }
}
