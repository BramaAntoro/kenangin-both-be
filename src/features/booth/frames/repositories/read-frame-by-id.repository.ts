import { eq } from "drizzle-orm";
import { db } from "../../../../db/index.js";
import { frames } from "../../../../db/schema.js";

/**
 * Mencari satu frame berdasarkan ID.
 *
 * @param frameId - ID frame yang akan dicari.
 * @returns Data frame jika ditemukan, atau `undefined` jika tidak ditemukan.
 */
export default async function readFrameByIdRepository(frameId: string) {
  const [frame] = await db
    .select()
    .from(frames)
    .where(eq(frames.id, frameId))
    .limit(1);

  return frame;
}
