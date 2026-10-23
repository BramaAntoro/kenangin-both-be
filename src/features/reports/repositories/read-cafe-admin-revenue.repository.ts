import { and, desc, eq, isNotNull, sql } from "drizzle-orm";
import { db } from "../../../db/index.js";
import { boothTransactions, cafeUsers, cafes } from "../../../db/schema.js";

export default async function readCafeAdminRevenueRepository(userId: string) {
  const scope = eq(cafeUsers.userId, userId);
  const [summary] = await db
    .select({
      totalCafeShareRevenue: sql<number>`COALESCE(SUM(${boothTransactions.cafeShareAmount}), 0)`.mapWith(Number),
      totalTransactions: sql<number>`COUNT(${boothTransactions.id})`.mapWith(Number),
    })
    .from(cafeUsers)
    .leftJoin(cafes, eq(cafes.id, cafeUsers.cafeId))
    .leftJoin(
      boothTransactions,
      and(
        eq(boothTransactions.cafeId, cafeUsers.cafeId),
        isNotNull(boothTransactions.paidAt),
      ),
    )
    .where(scope);

  const transactions = await db
    .select({
      id: boothTransactions.id,
      orderId: boothTransactions.orderId,
      cafeName: cafes.name,
      grossAmount: boothTransactions.grossAmount,
      cafeShareAmount: boothTransactions.cafeShareAmount,
      paymentType: boothTransactions.paymentType,
      paidAt: boothTransactions.paidAt,
    })
    .from(cafeUsers)
    .innerJoin(cafes, eq(cafes.id, cafeUsers.cafeId))
    .innerJoin(
      boothTransactions,
      and(
        eq(boothTransactions.cafeId, cafeUsers.cafeId),
        isNotNull(boothTransactions.paidAt),
      ),
    )
    .where(scope)
    .orderBy(desc(boothTransactions.paidAt))
    .limit(100);

  const managedCafes = await db
    .select({ id: cafes.id, name: cafes.name, address: cafes.address })
    .from(cafeUsers)
    .innerJoin(cafes, eq(cafes.id, cafeUsers.cafeId))
    .where(scope);

  return { summary, transactions, cafes: managedCafes };
}
