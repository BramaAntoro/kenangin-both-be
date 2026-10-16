import type { Request, Response } from "express";
import { apiError, apiSuccess } from "../../../lib/api/api-response.js";
import handleApiError from "../../../lib/api/handle-api-error.js";
import readRevenueRecapService from "../services/read-revenue-recap.service.js";

/**
 * Menangani request ringkasan revenue dan alokasi internal Kenangin
 * untuk Super Admin.
 *
 * @param _request - Request Express (tidak digunakan).
 * @param response - Response Express untuk mengirim ringkasan revenue.
 * @returns Promise yang menghasilkan response JSON ringkasan revenue.
 */
export default async function readRevenueRecapController(
  _request: Request,
  response: Response,
): Promise<Response> {
  try {
    const revenueRecap = await readRevenueRecapService();

    return apiSuccess(
      response,
      revenueRecap,
      "Laporan rekapitulasi revenue berhasil diambil",
    );
  } catch (error) {
    const { message, statusCode, details } = handleApiError(error);
    return apiError(response, message, statusCode, details);
  }
}
