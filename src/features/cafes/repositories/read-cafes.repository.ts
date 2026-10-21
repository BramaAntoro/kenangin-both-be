import { and, desc, eq, ilike, or, sql } from "drizzle-orm";
import { db } from "../../../db/index.js";
import { cafeUsers, cafes, users } from "../../../db/schema.js";
import type { CafeResult } from "../types/cafe-result.js";

/** Data cafe beserta admin yang mengelolanya. */
export type ReadCafeResult = {
  cafe: CafeResult;
  cafeAdmin: string;
};

export type ReadCafesParams = {
  page: number;
  limit: number;
  search?: string | undefined;
};

export type ReadCafesResult = {
  rows: ReadCafeResult[];
  totalItems: number;
};

/**
 * Mengambil seluruh cafe beserta admin cafe yang terhubung.
 *
 * @returns Daftar cafe dengan data admin berupa ID dan nama.
 */
export default async function readCafesRepository({
  page,
  limit,
  search,
}: ReadCafesParams): Promise<ReadCafesResult> {
  const searchCondition = search
    ? or(ilike(cafes.name, `%${search}%`), ilike(cafes.address, `%${search}%`))
    : undefined;
  const offset = (page - 1) * limit;

  const [countResult] = await db
    .select({ count: sql<number>`COUNT(*)`.mapWith(Number) })
    .from(cafes)
    .innerJoin(cafeUsers, eq(cafeUsers.cafeId, cafes.id))
    .innerJoin(users, and(eq(users.id, cafeUsers.userId), eq(users.role, "cafe_admin")))
    .where(searchCondition);

  const results = await db
    .select({
      cafe: cafes,
      cafeAdmin: {
        name: users.name,
      },
    })
    .from(cafes)
    .innerJoin(cafeUsers, eq(cafeUsers.cafeId, cafes.id))
    .innerJoin(
      users,
      and(
        eq(users.id, cafeUsers.userId),
        eq(users.role, "cafe_admin"),
      ),
    )
    .where(searchCondition)
    .orderBy(desc(cafes.createdAt))
    .limit(limit)
    .offset(offset);

  return {
    rows: results.map(({ cafe, cafeAdmin }) => ({
      cafe,
      cafeAdmin: cafeAdmin.name,
    })),
    totalItems: countResult?.count ?? 0,
  };
}
