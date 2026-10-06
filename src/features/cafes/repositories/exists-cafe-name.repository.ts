import { and, eq, ne } from "drizzle-orm";
import { db } from "../../../db/index.js";
import { cafes } from "../../../db/schema.js";

/** Mengecek apakah nama cafe sudah digunakan. */
export default async function existsCafeNameRepository(
  name: string,
  excludeCafeId?: string,
): Promise<boolean> {
  const [result] = await db
    .select({ id: cafes.id })
    .from(cafes)
    .where(
      excludeCafeId
        ? and(eq(cafes.name, name), ne(cafes.id, excludeCafeId))
        : eq(cafes.name, name),
    );

  return Boolean(result);
}
