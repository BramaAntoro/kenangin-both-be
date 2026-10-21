import type { Request, Response } from "express";
import { apiError, apiSuccess } from "../../../../lib/api/api-response.js";
import handleApiError from "../../../../lib/api/handle-api-error.js";
import readCafeAdminService from "../services/read-cafe-admin.service.js";

/**
 * Menangani pembacaan daftar akun cafe admin oleh super admin.
 */
export default async function readCafeAdminController(
  request: Request,
  response: Response,
): Promise<Response> {
  try {
    const page = Math.max(Number(request.query.page) || 1, 1);
    const limit = Math.min(Math.max(Number(request.query.limit) || 5, 1), 50);
    const search =
      typeof request.query.search === "string" && request.query.search.trim()
        ? request.query.search.trim()
        : undefined;
    const { cafeAdmins, totalItems } = await readCafeAdminService({
      page,
      limit,
      search,
    });

    return apiSuccess(
      response,
      { cafeAdmins },
      "Daftar cafe admin berhasil diambil",
      200,
      {
        currentPage: page,
        perPage: limit,
        totalItems,
        totalPages: Math.ceil(totalItems / limit),
      },
    );
  } catch (error) {
    const { message, statusCode, details } = handleApiError(error);
    return apiError(response, message, statusCode, details);
  }
}
