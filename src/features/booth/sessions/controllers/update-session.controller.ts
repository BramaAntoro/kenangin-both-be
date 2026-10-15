import type { Request, Response } from "express";
import { apiError, apiSuccess } from "../../../../lib/api/api-response.js";
import handleApiError from "../../../../lib/api/handle-api-error.js";
import AppError from "../../../../lib/app-error.js";
import parseAndValidateBody from "../../../../lib/api/parse-and-validate-body.js";
import { updateSessionSchema } from "../dto/update-session.dto.js";
import updateSessionService from "../services/update-session.service.js";
import { removeUploadedFile } from "../../../../lib/multer/remove-uploaded-file.js";

/**
 * Menangani pembaruan data sesi dan upload foto sesi.
 *
 * @param request - Request berisi session code, perubahan data, dan foto opsional.
 * @param response - Response Express untuk mengirim hasil pembaruan atau error.
 * @returns Promise yang menghasilkan response API.
 */
export default async function updateSessionController(
  request: Request,
  response: Response,
): Promise<Response> {
  const file = request.file;
  try {
    const sessionCode = request.params.sessionCode;

    if (typeof sessionCode !== "string" || !/^[\w-]+$/.test(sessionCode)) {
      throw new AppError("sessionCode tidak valid", 400);
    }

    const validatedData = await parseAndValidateBody(
      request,
      updateSessionSchema,
    );

    const session = await updateSessionService(
      sessionCode,
      validatedData,
      Boolean(file),
    );

    return apiSuccess(
      response,
      { finalDriveUrl: session.softfileUrl },
      "Session berhasil diperbarui",
    );
  } catch (error) {
    if (file) await removeUploadedFile(file.path);

    const { message, statusCode, details } = handleApiError(error);
    return apiError(response, message, statusCode, details);
  }
}
