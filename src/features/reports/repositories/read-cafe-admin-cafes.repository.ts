import { and, asc, eq, ilike, or, sql } from "drizzle-orm";
import { db } from "../../../db/index.js";
import { cafeUsers, cafes } from "../../../db/schema.js";

export interface CafeAdminCafesParams {
  userId: string;
  page: number;
  limit: number;
  search?: string | undefined;
}

export interface CafeAdminCafe {
  id: string;
  name: string;
  slug: string;
  address: string;
  phone: string;
  cafeSharePercent: number;
  kenanginSharePercent: number;
  isActive: boolean | null;
}

export interface CafeAdminCafesResult {
  rows: CafeAdminCafe[];
  totalItems: number;
}

/**
 * Mengambil daftar cafe yang dikelola oleh seorang cafe_admin
 * dengan dukungan pagination dan pencarian nama/alamat.
 *
 * @param params - userId, page, limit, search opsional
 * @returns Daftar cafe beserta total item untuk pagination
 */
export default async function readCafeAdminCafesRepository(
  params: CafeAdminCafesParams,
): Promise<CafeAdminCafesResult> {
  const { userId, page, limit, search } = params;
  const offset = (page - 1) * limit;

  const scope = eq(cafeUsers.userId, userId);
  const searchCondition = search
    ? or(
        ilike(cafes.name, `%${search}%`),
        ilike(cafes.address, `%${search}%`),
      )
    : undefined;

  const condition = searchCondition ? and(scope, searchCondition) : scope;

  const [countResult] = await db
    .select({ count: sql<number>`COUNT(*)`.mapWith(Number) })
    .from(cafeUsers)
    .innerJoin(cafes, eq(cafes.id, cafeUsers.cafeId))
    .where(condition);

  const rows = await db
    .select({
      id: cafes.id,
      name: cafes.name,
      slug: cafes.slug,
      address: cafes.address,
      phone: cafes.phone,
      cafeSharePercent: cafes.cafeSharePercent,
      kenanginSharePercent: cafes.kenanginSharePercent,
      isActive: cafes.isActive,
    })
    .from(cafeUsers)
    .innerJoin(cafes, eq(cafes.id, cafeUsers.cafeId))
    .where(condition)
    .orderBy(asc(cafes.name))
    .limit(limit)
    .offset(offset);

  return { rows, totalItems: countResult?.count ?? 0 };
}
