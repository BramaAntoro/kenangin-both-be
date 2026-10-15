import { eq } from "drizzle-orm";
import { db } from "../../../../db/index.js";
import { sessions } from "../../../../db/schema.js";

/**
 * Membaca satu sesi berdasarkan session code.
 *
 * @param sessionCode - Kode unik sesi yang dicari.
 * @returns Data sesi atau `undefined` jika tidak ditemukan.
 */
export async function readSessionRepository(sessionCode: string) {
  const [session] = await db
    .select({
      id: sessions.id,
      sessionCode: sessions.sessionCode,
      frameId: sessions.frameId,
      printStatus: sessions.printStatus,
      softfileUrl: sessions.softfileUrl,
      createdAt: sessions.createdAt,
    })
    .from(sessions)
    .where(eq(sessions.sessionCode, sessionCode))
    .limit(1);
  return session;
}
