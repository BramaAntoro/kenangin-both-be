import type { Request, Response } from "express";
import { apiError, apiSuccess } from "../../../../lib/api/api-response.js";
import handleApiError from "../../../../lib/api/handle-api-error.js";
import { removeUploadedFile } from "../../../../lib/multer/remove-uploaded-file.js";
import parseAndValidateBody from "../../../../lib/api/parse-and-validate-body.js";
import parseParams from "../../../../lib/api/parse-params.js";
import { updateFrameSchema } from "../dto/update-frame.dto.js";
import updateFrameService from "../services/update-frame.service.js";

/**
 * Memproses pembaruan data frame melalui endpoint HTTP.
 *
 * Controller membaca ID frame dari parameter URL, memvalidasi body multipart,
 * lalu meneruskan pembaruan serta file PNG opsional ke service.
 *
 * @param request - Request Express dengan parameter `id`, body pembaruan, dan file opsional.
 * @param response - Response Express untuk hasil pembaruan atau error.
 * @returns Response HTTP berisi frame yang telah diperbarui.
 */
export default async function updateFrameController(
  request: Request,
  response: Response,
): Promise<Response> {
  const uploadedFile = request.file;
  try {
    const frameId = parseParams(request.params.id);
    const { id: userId, role } = request.user!;
    const payload = await parseAndValidateBody(request, updateFrameSchema);

    const frame = await updateFrameService(
      frameId,
      userId,
      role,
      payload,
      uploadedFile?.filename,
    );

    return apiSuccess(response, { frame }, "Frame berhasil diperbarui");
  } catch (error) {
    if (uploadedFile) await removeUploadedFile(uploadedFile.path);

    const { message, statusCode, details } = handleApiError(error);
    return apiError(response, message, statusCode, details);
  }
}
