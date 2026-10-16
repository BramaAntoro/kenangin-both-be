import readGlobalRevenueRecapRepository from "../repositories/read-global-revenue-recap.repository.js";
import type { RevenueRecapResponse } from "../types/revenue-recap-result.js";

/**
 * Menyusun ringkasan revenue terpusat dan alokasi internal Kenangin
 * untuk Super Admin.
 *
 * Rata-rata transaksi harian dihitung dari jumlah hari antara transaksi
 * pertama hingga terakhir. Jika hanya 1 hari atau belum ada transaksi,
 * rata-rata sama dengan total transaksi.
 *
 * @returns Ringkasan global revenue dan alokasi internal Kenangin.
 */
export default async function readRevenueRecapService(): Promise<RevenueRecapResponse> {
  const globalRecap = await readGlobalRevenueRecapRepository();

  const totalTransactions = globalRecap?.totalTransactions ?? 0;

  // Hitung rata-rata transaksi harian berdasarkan rentang periode
  let averageDailyTransactions = totalTransactions;
  if (globalRecap?.firstTransactionDate && globalRecap?.lastTransactionDate) {
    const start = new Date(globalRecap.firstTransactionDate);
    const end = new Date(globalRecap.lastTransactionDate);
    const diffMs = end.getTime() - start.getTime();
    const diffDays = Math.max(Math.ceil(diffMs / (1000 * 60 * 60 * 24)), 1);
    averageDailyTransactions =
      Math.round((totalTransactions / diffDays) * 100) / 100;
  }

  return {
    summary: {
      totalGrossRevenue: globalRecap?.totalGrossRevenue ?? 0,
      totalCafeShareRevenue: globalRecap?.totalCafeShareRevenue ?? 0,
      totalKenanginShareRevenue: globalRecap?.totalKenanginShareRevenue ?? 0,
      totalTransactions,
      averageDailyTransactions,
      periodStart: globalRecap?.firstTransactionDate
        ? new Date(globalRecap.firstTransactionDate).toISOString()
        : null,
      periodEnd: globalRecap?.lastTransactionDate
        ? new Date(globalRecap.lastTransactionDate).toISOString()
        : null,
    },
    kenanginAllocation: {
      operasionalAmount: globalRecap?.totalOperasionalAmount ?? 0,
      maintenanceAmount: globalRecap?.totalMaintenanceAmount ?? 0,
      rndAmount: globalRecap?.totalRndAmount ?? 0,
      profitAmount: globalRecap?.totalProfitAmount ?? 0,
    },
  };
}
