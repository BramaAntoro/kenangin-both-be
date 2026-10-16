import readPerCafeRevenueRepository from "../repositories/read-per-cafe-revenue.repository.js";
import type { CafeRevenueBreakdown } from "../types/revenue-recap-result.js";

/**
 * Parameter query dari controller untuk daftar revenue cafe.
 */
export interface CafeRevenueQueryParams {
  page: number;
  limit: number;
  search?: string | undefined;
}

/**
 * Hasil service daftar revenue cafe beserta metadata pagination.
 */
export interface CafeRevenueServiceResult {
  cafes: CafeRevenueBreakdown[];
  meta: {
    currentPage: number;
    perPage: number;
    totalItems: number;
    totalPages: number;
  };
}

/**
 * Mengambil daftar revenue per cafe mitra dengan pagination dan search.
 *
 * @param query - Parameter pagination (page, limit) dan search opsional.
 * @returns Daftar revenue per cafe beserta metadata pagination.
 */
export default async function readCafeRevenueService(
  query: CafeRevenueQueryParams,
): Promise<CafeRevenueServiceResult> {
  const perCafe = await readPerCafeRevenueRepository({
    page: query.page,
    limit: query.limit,
    search: query.search,
  });

  return {
    cafes: perCafe.rows.map((cafe) => ({
      cafeId: cafe.cafeId,
      cafeName: cafe.cafeName,
      location: cafe.cafeAddress,
      status: cafe.isActive ? "active" : "inactive",
      totalGrossRevenue: cafe.totalGrossRevenue,
      totalCafeShareRevenue: cafe.totalCafeShareRevenue,
      totalKenanginShareRevenue: cafe.totalKenanginShareRevenue,
      totalTransactions: cafe.totalTransactions,
    })),
    meta: {
      currentPage: query.page,
      perPage: query.limit,
      totalItems: perCafe.totalItems,
      totalPages: Math.ceil(perCafe.totalItems / query.limit),
    },
  };
}
