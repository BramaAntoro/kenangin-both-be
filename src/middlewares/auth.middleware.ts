import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import AppError from "../lib/app-error.js";
import { apiError } from "../lib/api/api-response.js";
import getCookie from "../lib/cookie/get-cookie.js";
import handleApiError from "../lib/api/handle-api-error.js";
import {
  AUTH_COOKIE_NAME,
  JWT_AUDIENCE,
  JWT_ISSUER,
  JWT_SECRET,
} from "../lib/get-env.js";
import type { JwtTokenPayload } from "../types/jwt/jwt-token-payload.js";

/**
 * Memastikan request memiliki cookie JWT yang valid.
 *
 * Payload JWT yang valid disimpan pada `request.user` agar dapat digunakan
 * oleh controller atau middleware authorization berikutnya.
 *
 * @param request - Request Express yang akan diverifikasi.
 * @param response - Response Express untuk mengirim error autentikasi.
 * @param next - Fungsi untuk meneruskan request ke handler berikutnya.
 */
export default function authMiddleware(
  request: Request,
  response: Response,
  next: NextFunction,
): void {
  try {
    const token = getCookie(request, AUTH_COOKIE_NAME);

    if (!token) {
      throw new AppError("Anda harus login terlebih dahulu", 401);
    }

    const payload = jwt.verify(token, JWT_SECRET, {
      issuer: JWT_ISSUER,
      audience: JWT_AUDIENCE,
    });

    if (typeof payload === "string") {
      throw new AppError("Token autentikasi tidak valid", 401);
    }

    request.user = payload as JwtTokenPayload;
    next();
  } catch (error) {
    const normalizedError =
      error instanceof AppError
        ? error
        : new AppError("Token autentikasi tidak valid atau sudah kedaluwarsa", 401);
    const { message, statusCode, details } = handleApiError(normalizedError);

    apiError(response, message, statusCode, details);
  }
}
