import { eq } from "drizzle-orm";
import { db } from "../../../../db/index.js";
import { boothTransactions } from "../../../../db/schema.js";

/** Data kolom transaksi yang dapat diperbarui dari webhook pembayaran. */
type UpdateTransactionPayload = Partial<typeof boothTransactions.$inferInsert>;

/**
 * Memperbarui transaksi booth berdasarkan ID pesanan Midtrans.
 *
 * @param orderId - ID pesanan yang dikirim Midtrans.
 * @param payload - Kolom transaksi yang akan diperbarui.
 * @returns Transaksi yang diperbarui, atau `undefined` jika tidak ditemukan.
 */
export default async function updateTransactionRepository(
  orderId: string,
  payload: UpdateTransactionPayload,
) {
  const [transaction] = await db
    .update(boothTransactions)
    .set(payload)
    .where(eq(boothTransactions.orderId, orderId))
    .returning();

  return transaction;
}
