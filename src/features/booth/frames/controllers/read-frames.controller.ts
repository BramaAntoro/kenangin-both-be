import type { Request, Response } from "express";
import { apiError, apiSuccess } from "../../../../lib/api/api-response.js";
import handleApiError from "../../../../lib/api/handle-api-error.js";
import readFramesService from "../services/read-frames.service.js";

/**
 * Mengembalikan frame global dan frame custom berdasarkan akses user.
 *
 * `cafe_id` dapat digunakan untuk meminta frame dari satu cafe yang terhubung
 * ke user. Validasi akses dan pengelompokan response dilakukan oleh service.
 *
 * @param request - Request Express yang membawa user login dan query `cafe_id` opsional.
 * @param response - Response Express untuk mengirim hasil pembacaan frame.
 * @returns Response API berisi frame global dan frame yang dikelompokkan per cafe.
 */
export default async function readFramesController(
  request: Request,
  response: Response,
): Promise<Response> {
  try {
    const { id: userId, role } = request.user!;
    const cafeId = typeof request.query.cafe_id === "string"
      ? request.query.cafe_id
      : undefined;
    const search = typeof request.query.search === "string" && request.query.search.trim()
      ? request.query.search.trim()
      : undefined;
    const location = typeof request.query.location === "string"
      ? request.query.location
      : "all";
    const hasPagination = request.query.page !== undefined || request.query.limit !== undefined;
    const pagination = (role === "super_admin" && !cafeId) || (cafeId && hasPagination)
      ? {
          page: Math.max(Number(request.query.page) || 1, 1),
          limit: Math.min(Math.max(Number(request.query.limit) || 5, 1), 50),
          location,
          ...(search ? { search } : {}),
        }
      : undefined;
    const result = await readFramesService(userId, role, cafeId, pagination);

    return apiSuccess(
      response,
      {
        frames: result.frames,
        ...(result.locations && { locations: result.locations }),
      },
      "Daftar frame berhasil diambil",
      200,
      result.meta,
    );
  } catch (error) {
    const { message, statusCode, details } = handleApiError(error);
    return apiError(response, message, statusCode, details);
  }
}
