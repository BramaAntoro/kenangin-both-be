import { and, desc, eq, ilike, inArray, isNull, or, sql } from "drizzle-orm";
import { db } from "../../../../db/index.js";
import { cafes, frames } from "../../../../db/schema.js";

type ReadFramesPagination = {
  page: number;
  limit: number;
  search?: string;
  location?: string;
};

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

  const conditions = [];
  if (pagination) {
    if (pagination.location === "global") {
      conditions.push(isNull(frames.cafeId));
    } else if (pagination.location && pagination.location !== "all") {
      conditions.push(eq(frames.cafeId, pagination.location));
    }
    if (pagination.search) {
      conditions.push(ilike(frames.title, `%${pagination.search}%`));
    }
  } else if (cafeIds) {
    conditions.push(or(inArray(frames.cafeId, cafeIds), isNull(frames.cafeId))!);
  }
  const condition = conditions.length ? and(...conditions) : undefined;
  const [rows, countResult, locations] = await Promise.all([
    pagination
      ? (condition ? query.where(condition) : query)
          .orderBy(newestFirst)
          .limit(pagination.limit)
          .offset((pagination.page - 1) * pagination.limit)
      : (condition ? query.where(condition) : query).orderBy(newestFirst),
    pagination
      ? db
          .select({ count: sql<number>`COUNT(*)`.mapWith(Number) })
          .from(frames)
          .where(condition)
      : Promise.resolve(undefined),
    pagination
      ? db.select({ id: cafes.id, name: cafes.name }).from(cafes).orderBy(cafes.name)
      : Promise.resolve(undefined),
  ]);
  return {
    rows,
    totalItems: countResult?.[0]?.count,
    locations,
  };
}
