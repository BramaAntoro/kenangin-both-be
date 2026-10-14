import { MIDTRANS_SERVER_KEY } from "../../../../lib/get-env.js";
import crypto from "node:crypto";
import type { MidtransWebhookDto } from "../dto/midtrans-snap-webhook.dto.js";
import AppError from "../../../../lib/app-error.js";
import updateTransactionRepository from "../repositories/update-transaction.repository.js";

/**
 * Memvalidasi signature webhook Midtrans dan memperbarui status pembayaran
 * transaksi yang didukung.
 *
 * @param payload - Data notifikasi pembayaran dari Midtrans.
 * @returns Transaksi yang diperbarui, atau `null` untuk status yang tidak perlu
 * diperbarui.
 * @throws AppError Jika signature tidak valid atau transaksi tidak ditemukan.
 */
export default async function webhookService(payload: MidtransWebhookDto) {
  const {
    orderId,
    statusCode,
    grossAmount,
    signatureKey,
    transactionStatus,
    fraudStatus,
    paymentType
  } = payload;

  const hash = crypto
    .createHash("sha512")
    .update(`${orderId}${statusCode}${grossAmount}${MIDTRANS_SERVER_KEY}`)
    .digest("hex");
  if (signatureKey !== hash) {
    throw new AppError("Invalid signature key", 400);
  }

  const paymentStatus = (
    {
      settlement: statusCode === "200" ? "settlement" : undefined,
      capture:
        statusCode === "200" && fraudStatus === "accept"
          ? "settlement"
          : undefined,
      pending: "pending",
      deny: "deny",
      cancel: "cancel",
      expire: "expire",
      refund: undefined,
      partial_refund: undefined,
      authorize: undefined,
    } as const
  )[transactionStatus];

  if (!paymentStatus) return null;

  const transaction = await updateTransactionRepository(orderId, {
    paymentStatus, paymentType
  });
  if (!transaction) throw new AppError("Transaksi tidak ditemukan", 404);

  return transaction;
}
