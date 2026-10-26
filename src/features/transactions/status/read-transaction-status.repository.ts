import { and, eq } from "drizzle-orm";
import { db } from "../../../db/index.js";
import { boothPackages, boothTransactions, cafeUsers, sessions } from "../../../db/schema.js";

export default async function readTransactionStatusRepository(
  userId: string,
  orderId: string,
) {
  const [transaction] = await db
    .select({
      orderId: boothTransactions.orderId,
      paymentStatus: boothTransactions.paymentStatus,
      paidAt: boothTransactions.paidAt,
      grossAmount: boothTransactions.grossAmount,
      packageName: boothPackages.name,
      photoShotsCount: boothPackages.photoShotsCount,
      timerDuration: boothPackages.features,
      sessionCode: sessions.sessionCode,
      softfileUrl: sessions.softfileUrl,
      printStatus: sessions.printStatus,
    })
    .from(boothTransactions)
    .innerJoin(boothPackages, eq(boothPackages.id, boothTransactions.packageId))
    .innerJoin(cafeUsers, eq(cafeUsers.cafeId, boothTransactions.cafeId))
    .leftJoin(sessions, eq(sessions.transactionId, boothTransactions.id))
    .where(
      and(
        eq(boothTransactions.orderId, orderId),
        eq(cafeUsers.userId, userId),
      ),
    )
    .limit(1);

  return transaction;
}
