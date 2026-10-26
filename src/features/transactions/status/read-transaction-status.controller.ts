import type { Request, Response } from "express";
import AppError from "../../../lib/app-error.js";
import handleApiError from "../../../lib/api/handle-api-error.js";
import { apiError, apiSuccess } from "../../../lib/api/api-response.js";
import parseParams from "../../../lib/api/parse-params.js";
import readTransactionStatusRepository from "./read-transaction-status.repository.js";

export default async function readTransactionStatusController(
  request: Request,
  response: Response,
): Promise<Response> {
  try {
    const orderId = parseParams(request.params.orderId);
    const transaction = await readTransactionStatusRepository(
      request.user!.id,
      orderId,
    );
    if (!transaction) throw new AppError("Transaksi tidak ditemukan", 404);

    return apiSuccess(
      response,
      { transaction },
      "Status transaksi berhasil diambil",
    );
  } catch (error) {
    const { message, statusCode, details } = handleApiError(error);
    return apiError(response, message, statusCode, details);
  }
}
