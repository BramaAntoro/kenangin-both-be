import { and, desc, eq, ilike, inArray, isNull, or, sql } from "drizzle-orm";
import { db } from "../../../../db/index.js";
import { cafes, frames } from "../../../../db/schema.js";

type ReadFramesPagination = { page: number; limit: number; search?: string };

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
export default async function readFramesRepository(cafeIds?: string[], pagination?: ReadFramesPagination) {
  const query = db
    .select({ frame: frames, cafeName: cafes.name })
    .from(frames)
    .leftJoin(cafes, eq(frames.cafeId, cafes.id));
  const newestFirst = desc(frames.createdAt);

  const condition = pagination
    ? pagination.search
      ? ilike(frames.title, `%${pagination.search}%`)
      : undefined
    : cafeIds
      ? or(inArray(frames.cafeId, cafeIds), isNull(frames.cafeId))
      : undefined;
  const listFrames = condition ? query.where(condition) : query;
  const [rows, countResult] = await Promise.all([
    pagination
      ? listFrames.orderBy(newestFirst).limit(pagination.limit).offset((pagination.page - 1) * pagination.limit)
      : listFrames.orderBy(newestFirst),
    pagination
      ? pagination.search
        ? db
            .select({ count: sql<number>`COUNT(*)`.mapWith(Number) })
            .from(frames)
            .where(ilike(frames.title, `%${pagination.search}%`))
        : db.select({ count: sql<number>`COUNT(*)`.mapWith(Number) }).from(frames)
      : Promise.resolve(undefined),
  ]);
  return { rows, totalItems: countResult?.[0]?.count };
}
