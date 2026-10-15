import { db } from "../../../../db/index.js";
import { boothTransactions } from "../../../../db/schema.js";

/** Data transaksi booth yang akan disimpan. */
type CreateBoothTransactionRepositoryInput = typeof boothTransactions.$inferInsert

/** Executor database yang dibutuhkan untuk insert transaksi. */
type TransactionExecutor = Pick<typeof db, "insert">;

/**
 * Menyimpan transaksi booth dan mengembalikan baris yang dibuat.
 *
 * @param input - Data transaksi booth.
 * @param executor - Database atau transaction executor untuk operasi insert.
 * @returns Transaksi yang berhasil dibuat, atau `undefined` jika tidak ada
 * baris yang dikembalikan.
 */
export default async function createBoothTransactionRepository(
  input: CreateBoothTransactionRepositoryInput,
  executor: TransactionExecutor = db,
) {
  const [transaction] = await executor
    .insert(boothTransactions)
    .values(input)
    .returning();

  return transaction;
}
