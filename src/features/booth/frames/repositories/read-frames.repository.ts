import { desc, eq, inArray, isNull, or } from "drizzle-orm";
import { db } from "../../../../db/index.js";
import { cafes, frames } from "../../../../db/schema.js";

/**
 * Mengambil frame beserta nama cafe pemiliknya.
 *
 * Jika `cafeIds` tidak diberikan, seluruh frame akan diambil. Jika diberikan,
 * repository mengambil frame dari cafe tersebut dan tetap menyertakan frame
 * global yang memiliki `cafeId` bernilai `null`.
 *
 * @param cafeIds - Daftar ID cafe yang menjadi batas akses frame.
 * @returns Query builder yang menghasilkan data frame dan nama cafe.
 */
export default function readFramesRepository(cafeIds?: string[]) {
  const query = db
    .select({ frame: frames, cafeName: cafes.name })
    .from(frames)
    .leftJoin(cafes, eq(frames.cafeId, cafes.id));
  const newestFirst = desc(frames.createdAt);

  if (!cafeIds) {
    return query.orderBy(newestFirst);
  }
  
  const listFrames = query
    .where(or(inArray(frames.cafeId, cafeIds), isNull(frames.cafeId)))
    .orderBy(newestFirst);

  return listFrames;
}
