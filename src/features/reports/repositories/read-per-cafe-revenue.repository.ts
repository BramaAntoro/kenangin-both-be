import { sql, ilike, or } from "drizzle-orm";
import { db } from "../../../db/index.js";
import { boothTransactions, cafes } from "../../../db/schema.js";

/**
 * Rincian revenue per cafe.
 */
export interface CafeRevenueDetail {
  cafeId: string;
  cafeName: string;
  cafeAddress: string;
  isActive: boolean | null;
  totalGrossRevenue: number;
  totalCafeShareRevenue: number;
  totalKenanginShareRevenue: number;
  totalTransactions: number;
}

/**
 * Parameter query pagination dan search untuk revenue per cafe.
 */
export interface PerCafeRevenueParams {
  page: number;
  limit: number;
  search?: string | undefined;
}

/**
 * Hasil query revenue per cafe beserta total count untuk pagination.
 */
export interface PerCafeRevenueResult {
  rows: CafeRevenueDetail[];
  totalItems: number;
}

/**
 * Mengambil rincian revenue per cafe dari seluruh transaksi settlement
 * dengan dukungan pagination dan pencarian nama/alamat cafe.
 *
 * Melakukan LEFT JOIN dari tabel `cafes` ke `booth_transactions` agar
 * cafe yang belum memiliki transaksi tetap muncul dengan total 0.
 *
 * @param params - Parameter pagination (page, limit) dan search opsional.
 * @returns Rincian revenue per cafe dengan total item untuk pagination,
 * diurutkan berdasarkan total gross revenue tertinggi.
 */
export default async function readPerCafeRevenueRepository(
  params: PerCafeRevenueParams,
): Promise<PerCafeRevenueResult> {
  const { page, limit, search } = params;
  const offset = (page - 1) * limit;

  const searchCondition = search
    ? or(
        ilike(cafes.name, `%${search}%`),
        ilike(cafes.address, `%${search}%`),
      )
    : undefined;

  const [countResult] = await db
    .select({ count: sql<number>`COUNT(*)`.mapWith(Number) })
    .from(cafes)
    .where(searchCondition);
  const totalItems = countResult?.count ?? 0;

  const rows = await db
    .select({
      cafeId: cafes.id,
      cafeName: cafes.name,
      cafeAddress: cafes.address,
      isActive: cafes.isActive,
      totalGrossRevenue: sql<number>`COALESCE(SUM(${boothTransactions.grossAmount}), 0)`.mapWith(Number),
      totalCafeShareRevenue: sql<number>`COALESCE(SUM(${boothTransactions.cafeShareAmount}), 0)`.mapWith(Number),
      totalKenanginShareRevenue: sql<number>`COALESCE(SUM(${boothTransactions.kenanginShareAmount}), 0)`.mapWith(Number),
      totalTransactions: sql<number>`COUNT(${boothTransactions.id})`.mapWith(Number),
    })
    .from(cafes)
    .leftJoin(
      boothTransactions,
      sql`${cafes.id} = ${boothTransactions.cafeId} AND ${boothTransactions.paymentStatus} = 'settlement'`,
    )
    .where(searchCondition)
    .groupBy(cafes.id, cafes.name, cafes.address, cafes.isActive)
    .orderBy(sql`COALESCE(SUM(${boothTransactions.grossAmount}), 0) DESC`)
    .limit(limit)
    .offset(offset);

  return { rows, totalItems };
}
