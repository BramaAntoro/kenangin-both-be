import { and, asc, desc, eq, exists, sql } from "drizzle-orm";
import { db } from "../../../../db/index.js";
import { boothPackages, cafeUsers, cafes } from "../../../../db/schema.js";

type ReadBoothPackagesOptions = {
  page: number;
  limit: number;
};

/** Mengambil seluruh paket tanpa pagination, dikelompokkan service per cafe. */
export default function readBoothPackagesRepository(userId?: string) {
  const belongsToCurrentUser = userId
    ? exists(
        db
          .select({ value: sql`1` })
          .from(cafeUsers)
          .where(
            and(
              eq(cafeUsers.cafeId, cafes.id),
              eq(cafeUsers.userId, userId),
            ),
          ),
      )
    : undefined;

  return db
    .select({
      cafeId: cafes.id,
      cafeName: cafes.name,
      boothPackage: boothPackages,
    })
    .from(cafes)
    .leftJoin(boothPackages, eq(boothPackages.cafeId, cafes.id))
    .where(belongsToCurrentUser)
    .orderBy(
      asc(cafes.name),
      asc(boothPackages.price),
      desc(boothPackages.createdAt),
    );
}

/** Mengambil satu cafe beserta paket untuk halaman pagination. */
export async function readPaginatedBoothPackagesRepository(
  userId: string | undefined,
  cafeId: string,
  options: ReadBoothPackagesOptions,
) {
  const cafeAccess = userId
    ? exists(
        db
          .select({ value: sql`1` })
          .from(cafeUsers)
          .where(
            and(
              eq(cafeUsers.cafeId, cafes.id),
              eq(cafeUsers.userId, userId),
            ),
          ),
      )
    : undefined;
  const cafeCondition = cafeAccess
    ? and(eq(cafes.id, cafeId), cafeAccess)
    : eq(cafes.id, cafeId);

  const packageBelongsToCurrentUser = userId
    ? exists(
        db
          .select({ value: sql`1` })
          .from(cafeUsers)
          .where(
            and(
              eq(cafeUsers.cafeId, boothPackages.cafeId),
              eq(cafeUsers.userId, userId),
            ),
          ),
      )
    : undefined;
  const packageCondition = packageBelongsToCurrentUser
    ? and(eq(boothPackages.cafeId, cafeId), packageBelongsToCurrentUser)
    : eq(boothPackages.cafeId, cafeId);

  const [[cafe], packageRows, countRows] = await Promise.all([
    db
      .select({ id: cafes.id, name: cafes.name })
      .from(cafes)
      .where(cafeCondition)
      .limit(1),
    db
      .select({
        cafeId: cafes.id,
        cafeName: cafes.name,
        boothPackage: boothPackages,
      })
      .from(boothPackages)
      .innerJoin(cafes, eq(boothPackages.cafeId, cafes.id))
      .where(packageCondition)
      .orderBy(
        asc(cafes.name),
        asc(boothPackages.price),
        desc(boothPackages.createdAt),
      )
      .limit(options.limit)
      .offset((options.page - 1) * options.limit),
    db
      .select({ count: sql<number>`COUNT(*)`.mapWith(Number) })
      .from(boothPackages)
      .where(packageCondition),
  ]);

  return {
    cafe,
    rows: packageRows,
    totalItems: countRows[0]?.count ?? 0,
  };
}
