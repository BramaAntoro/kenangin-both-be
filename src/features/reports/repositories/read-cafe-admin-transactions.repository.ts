import { and, desc, eq, isNotNull, sql } from "drizzle-orm";
import { db } from "../../../db/index.js";
import { boothTransactions, cafeUsers, cafes } from "../../../db/schema.js";

type ReadCafeAdminTransactionsParams = {
  userId: string;
  page: number;
  limit: number;
};

export default async function readCafeAdminTransactionsRepository({
  userId,
  page,
  limit,
}: ReadCafeAdminTransactionsParams) {
  const scope = eq(cafeUsers.userId, userId);
  const paidTransactions = and(
    eq(boothTransactions.cafeId, cafeUsers.cafeId),
    isNotNull(boothTransactions.paidAt),
  );
  const [countResult, transactions] = await Promise.all([
    db
      .select({ count: sql<number>`COUNT(${boothTransactions.id})`.mapWith(Number) })
      .from(cafeUsers)
      .innerJoin(cafes, eq(cafes.id, cafeUsers.cafeId))
      .leftJoin(boothTransactions, paidTransactions)
      .where(scope),
    db
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
      .innerJoin(boothTransactions, paidTransactions)
      .where(scope)
      .orderBy(desc(boothTransactions.paidAt))
      .limit(limit)
      .offset((page - 1) * limit),
  ]);

  return { transactions, totalItems: countResult[0]?.count ?? 0 };
}
