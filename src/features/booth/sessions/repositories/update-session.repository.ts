import { eq } from "drizzle-orm";
import { db } from "../../../../db/index.js";
import { sessions } from "../../../../db/schema.js";
import type { UpdateSessionDto } from "../dto/update-session.dto.js";

/**
 * Memperbarui field sesi berdasarkan session code.
 *
 * @param sessionCode - Kode unik sesi yang akan diperbarui.
 * @param changes - Field database yang akan diubah.
 * @returns Data sesi yang diperbarui atau `undefined` jika tidak ditemukan.
 */
export default async function updateSessionRepository(
  sessionCode: string,
  changes: Partial<UpdateSessionDto> & { softfileUrl?: string },
) {
  const [session] = await db
    .update(sessions)
    .set(changes)
    .where(eq(sessions.sessionCode, sessionCode))
    .returning();
  return session;
}
