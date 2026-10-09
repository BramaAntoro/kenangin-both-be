import { mkdirSync } from "node:fs";
import { readFile, unlink } from "node:fs/promises";
import { join } from "node:path";
import multer from "multer";
import type { NextFunction, Request, Response } from "express";
import { apiError } from "../../../lib/api/api-response.js";
import handleApiError from "../../../lib/api/handle-api-error.js";
import AppError from "../../../lib/app-error.js";
import { hasPngTransparency } from "./png-transparency.js";

/** Direktori penyimpanan file PNG frame. */
export const uploadDirectory = join(process.cwd(), "uploads", "frames");
mkdirSync(uploadDirectory, { recursive: true });

/** Mengubah judul frame menjadi bagian nama file yang aman. */
function sanitizeFilenamePart(value: string): string {
  return (
    value
      .normalize("NFKC")
      .replace(/[^\p{L}\p{N}]+/gu, "-")
      .replace(/^-+|-+$/g, "")
      .toLowerCase() || "frame"
  );
}

/** Membuat penanda waktu yang aman untuk nama file. */
function formatDate(date: Date): string {
  const pad = (value: number, length = 2) =>
    String(value).padStart(length, "0");
  return [
    date.getFullYear(),
    pad(date.getMonth() + 1),
    pad(date.getDate()),
    pad(date.getHours()),
    pad(date.getMinutes()),
    pad(date.getSeconds()),
    pad(date.getMilliseconds(), 3),
  ].join("-");
}

/**
 * Konfigurasi Multer untuk satu file frame pada field `file`.
 *
 * File disimpan ke direktori frame dengan nama berdasarkan title dan waktu
 * upload. Validasi transparansi PNG dilakukan oleh `uploadFrame` setelah
 * Multer menyelesaikan proses penyimpanan file.
 */
const uploadSingleFile = multer({
  storage: multer.diskStorage({
    destination: uploadDirectory,
    filename: (request, _file, callback) => {
      const title =
        typeof request.body.title === "string" ? request.body.title.trim() : "";
      const filename = `${sanitizeFilenamePart(title)}-${formatDate(new Date())}.png`;
      callback(null, filename);
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024, files: 1 },
  fileFilter: (_request, file, callback) => {
    if (file.mimetype !== "image/png") {
      callback(new AppError("File harus berupa PNG", 400));
      return;
    }
    callback(null, true);
  },
}).single("file");

/**
 * Mengunggah satu PNG frame pada field `file`.
 *
 * File dibatasi hingga 5 MB, harus ber-MIME `image/png`, dan diperiksa agar
 * PNG valid serta memiliki setidaknya satu pixel transparan.
 *
 * @param request - Request multipart/form-data.
 * @param response - Response Express untuk error upload.
 * @param next - Meneruskan request setelah file lolos seluruh validasi.
 */
export default function uploadFrame(
  request: Request,
  response: Response,
  next: NextFunction,
): void {
  uploadSingleFile(request, response, async (error: unknown) => {
    if (error) {
      const { message, statusCode, details } = handleApiError(error);
      apiError(response, message, statusCode, details);
      return;
    }

    if (!request.file) {
      apiError(response, "File PNG wajib diunggah", 400);
      return;
    }

    let validTransparentPng = false;
    try {
      validTransparentPng = hasPngTransparency(await readFile(request.file.path));
    } catch {
      validTransparentPng = false;
    }
    if (!validTransparentPng) {
      await unlink(request.file.path).catch(() => undefined);
      apiError(response, "File harus berupa PNG valid dengan transparansi", 400);
      return;
    }

    next();
  });
}
