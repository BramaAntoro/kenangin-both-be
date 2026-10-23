import { isNotNull, sql } from "drizzle-orm";
import { db } from "../../../db/index.js";
import { boothTransactions } from "../../../db/schema.js";

/**
 * Hasil rekapitulasi global revenue seluruh mitra.
 */
export interface GlobalRevenueRecap {
  totalGrossRevenue: number;
  totalCafeShareRevenue: number;
  totalKenanginShareRevenue: number;
  totalTransactions: number;
  firstTransactionDate: Date | null;
  lastTransactionDate: Date | null;
  totalOperasionalAmount: number;
  totalMaintenanceAmount: number;
  totalRndAmount: number;
  totalProfitAmount: number;
}

/**
 * Mengambil rekapitulasi global seluruh revenue dari transaksi yang
 * sudah ada paidAt (sudah dibayar).
 *
 * Hanya transaksi yang memiliki `paidAt` yang dihitung agar angka
 * revenue mencerminkan dana yang benar-benar masuk.
 *
 * @returns Objek agregasi revenue global, atau `null` jika belum ada
 * transaksi yang dibayar.
 */
export default async function readGlobalRevenueRecapRepository(): Promise<GlobalRevenueRecap | null> {
  const [result] = await db
    .select({
      totalGrossRevenue: sql<number>`COALESCE(SUM(${boothTransactions.grossAmount}), 0)`.mapWith(Number),
      totalCafeShareRevenue: sql<number>`COALESCE(SUM(${boothTransactions.cafeShareAmount}), 0)`.mapWith(Number),
      totalKenanginShareRevenue: sql<number>`COALESCE(SUM(${boothTransactions.kenanginShareAmount}), 0)`.mapWith(Number),
      totalTransactions: sql<number>`COUNT(*)`.mapWith(Number),
      firstTransactionDate: sql<Date | null>`MIN(${boothTransactions.paidAt})`,
      lastTransactionDate: sql<Date | null>`MAX(${boothTransactions.paidAt})`,
      totalOperasionalAmount: sql<number>`COALESCE(SUM(${boothTransactions.operasionalAmount}), 0)`.mapWith(Number),
      totalMaintenanceAmount: sql<number>`COALESCE(SUM(${boothTransactions.maintenanceAmount}), 0)`.mapWith(Number),
      totalRndAmount: sql<number>`COALESCE(SUM(${boothTransactions.rndAmount}), 0)`.mapWith(Number),
      totalProfitAmount: sql<number>`COALESCE(SUM(${boothTransactions.profitAmount}), 0)`.mapWith(Number),
    })
    .from(boothTransactions)
    .where(isNotNull(boothTransactions.paidAt));

  return result ?? null;
}
