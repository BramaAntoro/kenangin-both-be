import { db } from "../../../../db/index.js";
import { sessions } from "../../../../db/schema.js";

type CreateSessionExecutor = Pick<typeof db, "insert">;

/**
 * Membuat sesi untuk transaksi yang telah dibayar.
 *
 * Webhook Midtrans dapat dikirim ulang, sehingga sesi yang sudah ada
 * berdasarkan `transactionId` tidak dibuat ulang.
 *
 * @param transactionId - ID transaksi yang telah diperbarui.
 * @param sessionCode - Kode unik untuk sesi foto.
 * @param executor - Database atau transaction executor.
 * @returns Sesi yang dibuat, atau `undefined` jika sesi sudah ada.
 */
export default async function createSessionRepository(
  transactionId: string,
  sessionCode: string,
  executor: CreateSessionExecutor = db,
) {
  const [session] = await executor
    .insert(sessions)
    .values({ transactionId, sessionCode })
    .onConflictDoNothing({ target: sessions.transactionId })
    .returning();

  return session;
}
