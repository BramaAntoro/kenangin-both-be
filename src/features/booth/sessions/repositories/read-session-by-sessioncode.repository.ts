import { eq } from "drizzle-orm";
import { db } from "../../../../db/index.js";
import { sessions } from "../../../../db/schema.js";

/**
 * Membaca satu sesi berdasarkan session code.
 *
 * @param sessionCode - Kode unik sesi yang dicari.
 * @returns Data sesi atau `undefined` jika tidak ditemukan.
 */
export async function readSession(sessionCode: string) {
  const [session] = await db
    .select()
    .from(sessions)
    .where(eq(sessions.sessionCode, sessionCode))
    .limit(1);
  return session;
}
