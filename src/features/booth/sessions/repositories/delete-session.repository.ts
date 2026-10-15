import { eq } from "drizzle-orm";
import { db } from "../../../../db/index.js";
import { sessions } from "../../../../db/schema.js";

/**
 * Menghapus sesi berdasarkan session code.
 *
 * @param sessionCode - Kode unik sesi yang akan dihapus.
 * @returns Sesi yang dihapus atau `undefined` jika tidak ditemukan.
 */
export default async function deleteSessionRepository(sessionCode: string) {
  const [session] = await db
    .delete(sessions)
    .where(eq(sessions.sessionCode, sessionCode))
    .returning();
  return session;
}
