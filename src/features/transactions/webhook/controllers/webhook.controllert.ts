import type { Request, Response } from "express";
import handleApiError from "../../../../lib/api/handle-api-error.js";
import { apiError, apiSuccess } from "../../../../lib/api/api-response.js";
import parseAndValidateBody from "../../../../lib/api/parse-and-validate-body.js";
import { midtransWebhookSchema } from "../dto/midtrans-snap-webhook.dto.js";
import webhookService from "../services/webhook.service.js";

/**
 * Menerima notifikasi webhook Midtrans dan meneruskan status transaksi yang
 * tervalidasi ke service.
 *
 * @param request - Request Express berisi payload notifikasi Midtrans.
 * @param response - Response Express untuk konfirmasi atau error.
 * @returns Promise yang menghasilkan response JSON.
 */
export default async function webhookController(
  request: Request,
  response: Response,
): Promise<Response> {
  try {
    const validatedData = await parseAndValidateBody(
      request,
      midtransWebhookSchema,
    );

    await webhookService(validatedData);

    return apiSuccess(
      response,
      { received: true },
      "Status transaksi berhasil diperbarui",
    );
    
  } catch (error) {
    const { message, statusCode, details } = handleApiError(error);
    return apiError(response, message, statusCode, details);
  }
}
