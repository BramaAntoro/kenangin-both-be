import { eq } from "drizzle-orm";
import { db } from "../../../../db/index.js";
import { frames } from "../../../../db/schema.js";
import type { UpdateFrameDto } from "../dto/update-frame.dto.js";

/** Memperbarui field frame yang dikirim beserta URL file jika diganti. */
export default async function updateFrameRepository(
  frameId: string,
  data: UpdateFrameDto & { frameUrl?: string },
) {
  const [updatedFrame] = await db
    .update(frames)
    .set({
      ...(data.title !== undefined && { title: data.title }),
      ...(data.max_photos_slot !== undefined && {
        maxPhotosSlot: data.max_photos_slot,
      }),
      ...(data.is_active !== undefined && { isActive: data.is_active }),
      ...(data.frameUrl !== undefined && { frameUrl: data.frameUrl }),
      updatedAt: new Date(),
    })
    .where(eq(frames.id, frameId))
    .returning();

  return updatedFrame;
}
