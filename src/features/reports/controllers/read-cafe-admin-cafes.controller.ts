import type { Request, Response } from "express";
import { apiError, apiSuccess } from "../../../lib/api/api-response.js";
import handleApiError from "../../../lib/api/handle-api-error.js";
import readCafeAdminCafesRepository from "../repositories/read-cafe-admin-cafes.repository.js";

/**
 * Menangani request daftar cafe yang dikelola cafe_admin
 * dengan dukungan pagination dan search.
 *
 * Query string yang didukung:
 * - `page`   — Halaman yang diminta (default: 1)
 * - `limit`  — Jumlah cafe per halaman (default: 4, max: 50)
 * - `search` — Kata kunci pencarian nama atau alamat cafe
 */
export default async function readCafeAdminCafesController(
  request: Request,
  response: Response,
): Promise<Response> {
  try {
    const userId = request.user!.id;
    const page = Math.max(Number(request.query.page) || 1, 1);
    const limit = Math.min(Math.max(Number(request.query.limit) || 4, 1), 50);
    const search =
      typeof request.query.search === "string" && request.query.search.trim()
        ? request.query.search.trim()
        : undefined;

    const { rows, totalItems } = await readCafeAdminCafesRepository({
      userId,
      page,
      limit,
      search,
    });

    return apiSuccess(
      response,
      { cafes: rows },
      "Daftar kafe berhasil diambil",
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
