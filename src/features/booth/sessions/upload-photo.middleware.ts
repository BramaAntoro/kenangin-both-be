import multer from "multer";
import type { NextFunction, Request, Response } from "express";
import AppError from "../../../lib/app-error.js";
import { apiError } from "../../../lib/api/api-response.js";
import handleApiError from "../../../lib/api/handle-api-error.js";
import { photoDirectory } from "./photo-file.js";

/** Konfigurasi Multer untuk satu foto JPEG pada field `file`. */
const upload = multer({
  storage: multer.diskStorage({
    destination: photoDirectory,
    filename: (request, _file, callback) => {
      const sessionCode = request.params.sessionCode;
      if (typeof sessionCode !== "string" || !/^[\w-]+$/.test(sessionCode)) {
        callback(new AppError("sessionCode tidak valid", 400), "");
        return;
      }
      callback(null, `${sessionCode}.jpg`);
    },
  }),
  limits: { fileSize: 10 * 1024 * 1024, files: 1 },
  fileFilter: (_request, file, callback) => {
    if (file.mimetype !== "image/jpeg") {
      callback(new AppError("File foto harus berupa JPEG", 400));
      return;
    }
    callback(null, true);
  },
}).single("file");

/**
 * Menangani upload foto sesi dan mengubah error Multer menjadi response API.
 *
 * @param request - Request multipart yang berisi foto dan session code.
 * @param response - Response Express untuk mengirim error upload.
 * @param next - Callback untuk melanjutkan request setelah upload berhasil.
 */
export default function uploadPhoto(
  request: Request,
  response: Response,
  next: NextFunction,
): void {
  upload(request, response, (error: unknown) => {
    if (!error) return next();

    const { message, statusCode, details } = handleApiError(error);
    return apiError(response, message, statusCode, details);
  });
}
