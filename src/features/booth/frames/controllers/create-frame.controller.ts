import type { Request, Response } from "express";
import { apiError, apiSuccess } from "../../../../lib/api/api-response.js";
import handleApiError from "../../../../lib/api/handle-api-error.js";
import createFrameService from "../services/create-frame.service.js";
import { createFrameSchema } from "../dto/create-frame.dto.js";
import parseAndValidateBody from "../../../../lib/api/parse-and-validate-body.js";
import { removeUploadedFile } from "../../../../lib/multer/remove-uploaded-file.js";

/**
 * Membuat frame baru dari PNG yang telah diunggah.
 *
 * Middleware upload memastikan file tersedia dan valid sebelum controller ini
 * dijalankan. Jika validasi body atau penyimpanan frame gagal, file yang sudah
 * tersimpan akan dihapus.
 *
 * @param request - Request dengan body multipart, file PNG, dan user JWT.
 * @param response - Response Express untuk hasil pembuatan frame.
 * @returns Response API berisi frame yang baru dibuat.
 */
export default async function createFrameController(
  request: Request,
  response: Response,
): Promise<Response> {
  const uploadedFile = request.file!;
  try {
    const validatedData = await parseAndValidateBody(
      request,
      createFrameSchema,
    );

    const { id: userId, role } = request.user!;

    const frame = await createFrameService(
      validatedData,
      userId,
      role,
      uploadedFile.filename,
    );

    return apiSuccess(response, { frame }, "Frame berhasil dibuat", 201);
  } catch (error) {
    await removeUploadedFile(uploadedFile.path);

    const { message, statusCode, details } = handleApiError(error);
    return apiError(response, message, statusCode, details);
  }
}
