import { eq } from "drizzle-orm";
import { db } from "../../../db/index.js";
import { kiosks } from "../../../db/schema.js";

export default async function readCafeKiosksRepository(cafeId: string) {
  return db
    .select({ name: kiosks.name })
    .from(kiosks)
    .where(eq(kiosks.cafeId, cafeId));
}
