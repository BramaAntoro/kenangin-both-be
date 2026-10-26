import type { Request, Response } from "express";
import { apiError, apiSuccess } from "../../../../lib/api/api-response.js";
import handleApiError from "../../../../lib/api/handle-api-error.js";
import parseAndValidateBody from "../../../../lib/api/parse-and-validate-body.js";
import { transactionInitiateSchema } from "../dto/transaction-initiate.dto.js";
import transactionInitiateService from "../service/transaction-initiate.service.js";

/**
 * Membuat transaksi booth dan meminta Snap token pembayaran dari Midtrans.
 *
 * Data cafe diambil dari user yang sedang login, sehingga caller tidak dapat
 * membuat transaksi untuk cafe lain.
 *
 * @param request - Request berisi `packageId` dan `kioskId` opsional.
 * @param response - Response Express untuk hasil transaksi atau error.
 * @returns Promise yang menghasilkan response JSON transaksi.
 */
export default async function transactionInitiateController(
  request: Request,
  response: Response,
): Promise<Response> {
  try {
    const validatedData = await parseAndValidateBody(
      request,
      transactionInitiateSchema,
    );

    const transaction = await transactionInitiateService(
      validatedData,
      request.user!,
    );

    return apiSuccess(
      response,
      {
        orderId: transaction.orderId,
        grossAmount: transaction.grossAmount,
        snapToken: transaction.snapToken,
      },
      "Transaksi berhasil dibuat",
      201,
    );
  } catch (error) {
    const { message, statusCode, details } = handleApiError(error);
    return apiError(response, message, statusCode, details);
  }
}
