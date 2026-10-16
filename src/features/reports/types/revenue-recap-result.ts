/**
 * Rincian alokasi internal dana Kenangin.
 */
export interface KenanginAllocation {
  operasionalAmount: number;
  maintenanceAmount: number;
  rndAmount: number;
  profitAmount: number;
}

/**
 * Payload response API ringkasan revenue terpusat (tanpa daftar cafe).
 */
export interface RevenueRecapResponse {
  summary: {
    totalGrossRevenue: number;
    totalCafeShareRevenue: number;
    totalKenanginShareRevenue: number;
    totalTransactions: number;
    averageDailyTransactions: number;
    periodStart: string | null;
    periodEnd: string | null;
  };
  kenanginAllocation: KenanginAllocation;
}

/**
 * Rincian revenue per cafe yang dikembalikan ke client.
 */
export interface CafeRevenueBreakdown {
  cafeId: string;
  cafeName: string;
  location: string;
  status: string;
  totalGrossRevenue: number;
  totalCafeShareRevenue: number;
  totalKenanginShareRevenue: number;
  totalTransactions: number;
}
