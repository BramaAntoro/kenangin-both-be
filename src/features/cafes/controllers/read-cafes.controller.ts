import type { Request, Response } from "express";
import { apiError, apiSuccess } from "../../../lib/api/api-response.js";
import handleApiError from "../../../lib/api/handle-api-error.js";
import readCafesService from "../services/read-cafes.service.js";

/**
 * Menangani pengambilan seluruh data cafe.
 *
 * @param _request - Request Express untuk endpoint daftar cafe.
 * @param response - Response Express untuk mengirim daftar cafe.
 * @returns Promise yang menghasilkan response JSON daftar cafe.
 */
export default async function readCafesController(
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
    const { rows, totalItems } = await readCafesService({ page, limit, search });
    const cafes = Object.fromEntries(
      rows.map(({ cafe, cafeAdmin }) => [
        cafe.name,
        {
          ...cafe,
          cafeAdmin,
        },
      ]),
    );

    return apiSuccess(
      response,
      { cafes },
      "Daftar cafe berhasil diambil",
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
