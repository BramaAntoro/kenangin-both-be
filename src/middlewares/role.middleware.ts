import type { NextFunction, Request, Response } from "express";
import AppError from "../lib/app-error.js";
import { apiError } from "../lib/api/api-response.js";
import handleApiError from "../lib/api/handle-api-error.js";
import type { JwtTokenPayload } from "../types/jwt/jwt-token-payload.js";

/**
 * Membatasi akses route berdasarkan role user yang sudah diautentikasi.
 *
 * @param allowedRoles - Role yang diizinkan mengakses route.
 * @returns Middleware Express untuk memeriksa role user.
 */
export default function requireRole(
  ...allowedRoles: JwtTokenPayload["role"][]
): (request: Request, response: Response, next: NextFunction) => void {
  return (request, response, next) => {
    try {
      const userRole = request.user?.role;

      if (!userRole || !allowedRoles.includes(userRole)) {
        throw new AppError("Anda tidak memiliki akses ke resource ini", 403);
      }

      next();
    } catch (error) {
      const normalizedError =
        error instanceof AppError
          ? error
          : new AppError("Gagal memeriksa hak akses", 500);
      const { message, statusCode, details } = handleApiError(normalizedError);

      apiError(response, message, statusCode, details);
    }
  };
}
