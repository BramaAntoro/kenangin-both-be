import type { Request, Response } from "express";
import { apiError, apiSuccess } from "../../../lib/api/api-response.js";
import handleApiError from "../../../lib/api/handle-api-error.js";
import readCafeAdminRevenueRepository from "../repositories/read-cafe-admin-revenue.repository.js";

export default async function readCafeAdminRevenueController(
  request: Request,
  response: Response,
): Promise<Response> {
  try {
    const result = await readCafeAdminRevenueRepository(request.user!.id);
    return apiSuccess(response, result, "Ringkasan pendapatan kafe berhasil diambil");
  } catch (error) {
    const { message, statusCode, details } = handleApiError(error);
    return apiError(response, message, statusCode, details);
  }
}
