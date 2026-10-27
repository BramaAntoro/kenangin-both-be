import type { Request, Response } from "express";
import { apiError, apiSuccess } from "../../../lib/api/api-response.js";
import handleApiError from "../../../lib/api/handle-api-error.js";
import readCafeAdminTransactionsRepository from "../repositories/read-cafe-admin-transactions.repository.js";

export default async function readCafeAdminTransactionsController(
  request: Request,
  response: Response,
): Promise<Response> {
  try {
    const page = Math.max(Number(request.query.page) || 1, 1);
    const limit = Math.min(Math.max(Number(request.query.limit) || 10, 1), 100);
    const { transactions, totalItems } =
      await readCafeAdminTransactionsRepository({
        userId: request.user!.id,
        page,
        limit,
      });

    return apiSuccess(
      response,
      { transactions },
      "Riwayat transaksi berhasil diambil",
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
