import type { Request, Response } from "express";
import { apiError, apiSuccess } from "../../../lib/api/api-response.js";
import handleApiError from "../../../lib/api/handle-api-error.js";
import AppError from "../../../lib/app-error.js";
import parseParams from "../../../lib/api/parse-params.js";
import readKiosksService from "../services/read-kiosks.service.js";
import { readPaginatedKiosksRepository } from "../repositories/read-kiosks.repository.js";

/**
 * Menangani pengambilan data kiosk yang dikelompokkan berdasarkan nama cafe.
 *
 * @param request - Request Express yang sudah diautentikasi (memiliki request.user).
 * @param response - Response Express untuk mengirim hasil query kiosk.
 * @returns Promise yang menghasilkan response JSON berisi list kiosk.
 */
export default async function readKiosksController(
  request: Request,
  response: Response,
): Promise<Response> {
  try {
    if (request.user?.role === "super_admin" && Object.keys(request.query).length) {
      const page = Math.max(Number(request.query.page) || 1, 1);
      const limit = Math.min(Math.max(Number(request.query.limit) || 5, 1), 50);
      const search =
        typeof request.query.search === "string" && request.query.search.trim()
          ? request.query.search.trim()
          : undefined;
      const { kiosks, totalItems } = await readPaginatedKiosksRepository({
        page,
        limit,
        search,
      });

      return apiSuccess(
        response,
        { kiosks },
        "Daftar kiosk berhasil diambil",
        200,
        {
          currentPage: page,
          perPage: limit,
          totalItems,
          totalPages: Math.ceil(totalItems / limit),
        },
      );
    }

    const result = await readKiosksService(request.user!);

    return apiSuccess(response, result, "Daftar kiosk berhasil diambil");
  } catch (error) {
    const { message, statusCode, details } = handleApiError(error);
    return apiError(response, message, statusCode, details);
  }
}

export async function readCafeKiosksController(
  request: Request,
  response: Response,
): Promise<Response> {
  try {
    const cafeId = parseParams(request.params.cafeId);
    const grouped = await readKiosksService(request.user!, cafeId);
    const kiosks = Object.values(grouped).flat();

    return apiSuccess(response, { kiosks }, "Daftar kiosk cafe berhasil diambil");
  } catch (error) {
    const { message, statusCode, details } = handleApiError(error);
    return apiError(response, message, statusCode, details);
  }
}
