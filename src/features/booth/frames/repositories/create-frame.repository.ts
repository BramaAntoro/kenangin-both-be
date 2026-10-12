import { db } from "../../../../db/index.js";
import { frames } from "../../../../db/schema.js";
import type { CreateFrameDto } from "../dto/create-frame.dto.js";

/**
 * Menyimpan frame baru ke database.
 *
 * @param input - Data frame tervalidasi beserta URL file hasil upload.
 * @returns Frame yang berhasil disimpan.
 */
export default async function createFrameRepository(
  input: CreateFrameDto & { frameUrl: string },
) {
  const [frame] = await db.insert(frames).values({
    title: input.title,
    frameUrl: input.frameUrl,
    maxPhotosSlot: input.maxPhotosSlot,
    cafeId: input.cafeId,
  }).returning();
  return frame;
}
