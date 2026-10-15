import { z } from "zod";

// Schema menerima nama field asli Midtrans, lalu mengubahnya ke camelCase internal.
export const midtransWebhookSchema = z
  .object({
    order_id: z.string().min(1, "Order ID wajib ada"),
    transaction_status: z.enum([
      "capture",
      "settlement",
      "pending",
      "deny",
      "cancel",
      "expire",
      "refund",
      "partial_refund",
      "authorize",
    ]),
    status_code: z.string(),
    gross_amount: z.string(),
    signature_key: z.string(),
    payment_type: z.string(),
    transaction_id: z.string(),
    transaction_time: z.string(),
    status_message: z.string().optional(),
    merchant_id: z.string().optional(),
    fraud_status: z.string().optional(),
    currency: z.string().optional(),
    va_numbers: z
      .array(
        z.object({
          bank: z.string(),
          va_number: z.string(),
        }),
      )
      .optional(),
    payment_amounts: z
      .array(
        z.object({
          paid_at: z.string(),
          amount: z.string(),
        }),
      )
      .optional(),
  })
  .transform((payload) => ({
    orderId: payload.order_id,
    transactionStatus: payload.transaction_status,
    statusCode: payload.status_code,
    grossAmount: payload.gross_amount,
    signatureKey: payload.signature_key,
    paymentType: payload.payment_type,
    transactionId: payload.transaction_id,
    transactionTime: payload.transaction_time,
    statusMessage: payload.status_message,
    merchantId: payload.merchant_id,
    fraudStatus: payload.fraud_status,
    currency: payload.currency,
    vaNumbers: payload.va_numbers,
    paymentAmounts: payload.payment_amounts,
  }));

// Infer Tipe Data TypeScript dari Schema
export type MidtransWebhookDto = z.infer<typeof midtransWebhookSchema>;
