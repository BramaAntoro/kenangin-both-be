import { randomUUID } from "node:crypto";
import { db } from "../../../../db/index.js";
import AppError from "../../../../lib/app-error.js";
import findCafeIdByUserIdRepository from "../../../booth/repositories/find-cafe-id-by-user-id.repository.js";
import type { transactionInitiateDto } from "../dto/transaction-initiate.dto.js";
import type { JwtTokenPayload } from "../../../../types/jwt/jwt-token-payload.js";
import createBoothTransactionRepository from "../repositories/create-booth-transaction.repository.js";
import readCafeRevenueShareRepository from "../repositories/read-cafe-revenue-share.repository.js";
import readTransactionInitiatePackagePriceRepository from "../repositories/read-transaction-initiate-package-price.repository.js";
import createMidtransSnap from "../../../../lib/clients/midtrans-snap.js";

/**
 * Menginisiasi transaksi booth, membuat Snap token, dan menyimpan pembagian
 * pendapatan transaksi ke database.
 *
 * @param payload - ID paket dan kiosk yang dipilih.
 * @param user - Data user cafe admin dari JWT.
 * @returns Data transaksi yang berhasil disimpan.
 * @throws AppError Jika cafe, paket, kiosk, atau transaksi tidak ditemukan.
 */
export default async function transactionInitiateService(
  payload: transactionInitiateDto,
  user: JwtTokenPayload,
) {
  const cafe = await findCafeIdByUserIdRepository(user.id);
  if (!cafe) {
    throw new AppError("Cafe tidak ada", 404);
  }

  const { packageId, kioskId } = payload;
  const packageData = await readTransactionInitiatePackagePriceRepository({
    cafeId: cafe.cafeId,
    packageId,
    kioskId,
  });
  if (!packageData) {
    throw new AppError("Paket atau kiosk tidak ditemukan", 404);
  }

  const revenueShare = await readCafeRevenueShareRepository(cafe.cafeId);
  if (!revenueShare) {
    throw new AppError("Cafe tidak ada", 404);
  }

  const grossAmount = packageData.price;
  const totalSharePercent =
    revenueShare.cafeSharePercent + revenueShare.kenanginSharePercent;
  const cafeShareAmount = Math.round(
    (grossAmount * revenueShare.cafeSharePercent) / totalSharePercent,
  );
  const kenanginShareAmount = grossAmount - cafeShareAmount;
  const operasionalAmount = Math.round(kenanginShareAmount / 3);
  const maintenanceAmount = Math.round(kenanginShareAmount / 6);
  const rndAmount = Math.round(kenanginShareAmount / 6);
  const profitAmount =
    kenanginShareAmount - operasionalAmount - maintenanceAmount - rndAmount;
  const orderId = `KNG-${randomUUID()}`;

  const transaction = await db.transaction(async (tx) => {
    const snapTokenMidtrans = await createMidtransSnap({
      orderId,
      grossAmount,
      customer: { firstName: user.name, email: user.email },
      items: [
        {
          id: packageId,
          name: packageData.name,
          price: grossAmount,
          quantity: 1,
        },
      ],
    });

    if (!snapTokenMidtrans) {
      throw new Error("Midtrans returned an empty Snap token");
    }

    return await createBoothTransactionRepository(
      {
        kioskId,
        cafeId: cafe.cafeId,
        packageId,
        orderId,
        grossAmount,
        cafeShareAmount,
        kenanginShareAmount,
        operasionalAmount,
        maintenanceAmount,
        rndAmount,
        profitAmount,
        paymentStatus: "pending",
        snapToken: snapTokenMidtrans,
      },
      tx,
    );
  });

  if (!transaction) {
    throw new AppError("Gagal membuat transaksi", 500);
  }

  return transaction;
}
