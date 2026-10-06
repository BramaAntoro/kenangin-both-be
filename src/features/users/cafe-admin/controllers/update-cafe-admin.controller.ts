import type { Request, Response } from "express";
import { apiError, apiSuccess } from "../../../../lib/api/api-response.js";
import handleApiError from "../../../../lib/api/handle-api-error.js";
import parseAndValidateBody from "../../../../lib/api/parse-and-validate-body.js";
import parseParams from "../../../../lib/api/parse-params.js";
import { updateCafeAdminSchema } from "../dto/update-cafe-admin.dto.js";
import updateCafeAdminService from "../services/update-cafe-admin.service.js";

/**
 * Menangani pembaruan akun cafe admin oleh super admin.
 *
 * @param request - Request Express berisi ID pada parameter dan data perubahan pada body.
 * @param response - Response Express untuk mengirim hasil pembaruan.
 * @returns Promise yang menghasilkan response JSON akun cafe admin yang diperbarui.
 */
export default async function updateCafeAdminController(
  request: Request,
  response: Response,
): Promise<Response> {
  try {
    const id = parseParams(request.params.id);
    const payload = await parseAndValidateBody(
      request,
      updateCafeAdminSchema,
    );
    const user = await updateCafeAdminService({ id, ...payload });

    return apiSuccess(
      response,
      { user },
      "Akun cafe admin berhasil diperbarui",
    );
  } catch (error) {
    const { message, statusCode, details } = handleApiError(error);
    return apiError(response, message, statusCode, details);
  }
}
