import type { Request, Response } from "express";
import { apiError, apiSuccess } from "../../../lib/api/api-response.js";
import handleApiError from "../../../lib/api/handle-api-error.js";
import readCafeRevenueService from "../services/read-cafe-revenue.service.js";

/**
 * Menangani request daftar revenue per cafe mitra untuk Super Admin.
 *
 * Mendukung query string:
 * - `page`   — Halaman yang diminta (default: 1)
 * - `limit`  — Jumlah cafe per halaman (default: 5, max: 50)
 * - `search` — Kata kunci pencarian nama atau alamat cafe
 *
 * @param request - Request Express dengan query string opsional.
 * @param response - Response Express untuk mengirim daftar revenue cafe.
 * @returns Promise yang menghasilkan response JSON daftar revenue cafe.
 */
export default async function readCafeRevenueController(
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

    const { cafes, meta } = await readCafeRevenueService({
      page,
      limit,
      search,
    });

    return apiSuccess(
      response,
      { cafes },
      "Daftar revenue per cafe berhasil diambil",
      200,
      meta,
    );
  } catch (error) {
    const { message, statusCode, details } = handleApiError(error);
    return apiError(response, message, statusCode, details);
  }
}
