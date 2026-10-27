import { and, eq, isNotNull, sql } from "drizzle-orm";
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

  return { summary };
}
