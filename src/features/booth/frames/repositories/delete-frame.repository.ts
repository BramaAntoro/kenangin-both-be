import { eq } from "drizzle-orm";
import { db } from "../../../../db/index.js";
import { frames } from "../../../../db/schema.js";

/**
 * Menonaktifkan frame tanpa menghapus record dari database.
 *
 * Record dipertahankan agar relasi sesi foto lama tetap valid.
 *
 * @param frameId - ID frame yang akan dinonaktifkan.
 * @returns Data frame yang diperbarui, atau `undefined` jika tidak ditemukan.
 */
export default async function deleteFrameRepository(frameId: string) {
  const [frame] = await db
    .update(frames)
    .set({ isActive: false, updatedAt: new Date() })
    .where(eq(frames.id, frameId))
    .returning();

  return frame;
}
