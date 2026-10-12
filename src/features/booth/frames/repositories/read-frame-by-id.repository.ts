import { eq } from "drizzle-orm";
import { db } from "../../../../db/index.js";
import { frames } from "../../../../db/schema.js";

/** Mencari satu frame berdasarkan ID. */
export default async function readFrameByIdRepository(frameId: string) {
  const [frame] = await db
    .select()
    .from(frames)
    .where(eq(frames.id, frameId))
    .limit(1);

  return frame;
}
