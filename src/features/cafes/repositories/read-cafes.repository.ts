import { and, desc, eq } from "drizzle-orm";
import { db } from "../../../db/index.js";
import { cafeUsers, cafes, users } from "../../../db/schema.js";
import type { CafeResult } from "../types/cafe-result.js";

/** Data cafe beserta admin yang mengelolanya. */
export type ReadCafeResult = {
  cafe: CafeResult;
  cafeAdmin: string;
};

/**
 * Mengambil seluruh cafe beserta admin cafe yang terhubung.
 *
 * @returns Daftar cafe dengan data admin berupa ID dan nama.
 */
export default async function readCafesRepository(): Promise<ReadCafeResult[]> {
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
    .orderBy(desc(cafes.createdAt));

  return results.map(({ cafe, cafeAdmin }) => ({
    cafe,
    cafeAdmin: cafeAdmin.name,
  }));
}
