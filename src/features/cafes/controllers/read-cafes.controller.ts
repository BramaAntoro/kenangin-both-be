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
  _request: Request,
  response: Response,
): Promise<Response> {
  try {
    const cafeResults = await readCafesService();
    const cafes = Object.fromEntries(
      cafeResults.map(({ cafe, cafeAdmin }) => [
        cafe.name,
        {
          ...cafe,
          cafeAdmin,
        },
      ]),
    );

    return apiSuccess(response, { cafes }, "Daftar cafe berhasil diambil");
  } catch (error) {
    const { message, statusCode, details } = handleApiError(error);
    return apiError(response, message, statusCode, details);
  }
}
