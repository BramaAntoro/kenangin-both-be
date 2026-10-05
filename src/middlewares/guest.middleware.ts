import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import AppError from "../lib/app-error.js";
import { apiError } from "../lib/api/api-response.js";
import handleApiError from "../lib/api/handle-api-error.js";
import {
  AUTH_COOKIE_NAME,
  JWT_AUDIENCE,
  JWT_ISSUER,
  JWT_SECRET,
} from "../lib/get-env.js";
import getCookie from "../lib/cookie/get-cookie.js";

/**
 * Memastikan request berasal dari user yang belum login.
 *
 * Request tanpa cookie atau dengan token yang sudah tidak valid tetap dapat
 * melanjutkan proses login. Request dengan token yang masih valid ditolak.
 *
 * @param request - Request Express yang akan diperiksa.
 * @param response - Response Express untuk mengirim error jika sudah login.
 * @param next - Fungsi untuk meneruskan request ke controller login.
 */
export default function guestMiddleware(
  request: Request,
  response: Response,
  next: NextFunction,
): void {
  try {
    const token = getCookie(request, AUTH_COOKIE_NAME);

    if (!token) {
      next();
      return;
    }

    jwt.verify(token, JWT_SECRET, {
      issuer: JWT_ISSUER,
      audience: JWT_AUDIENCE,
    });

    const error = new AppError("Anda sudah login", 409);
    const { message, statusCode, details } = handleApiError(error);
    apiError(response, message, statusCode, details);
  } catch {
    next();
  }
}
