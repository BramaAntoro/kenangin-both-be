import { eq } from "drizzle-orm";
import { db } from "../../../../db/index.js";
import { cafeUsers, cafes } from "../../../../db/schema.js";

export default async function readCafeAdminCafesRepository(userId: string) {
  return db
    .select({ id: cafes.id, name: cafes.name, slug: cafes.slug })
    .from(cafeUsers)
    .innerJoin(cafes, eq(cafes.id, cafeUsers.cafeId))
    .where(eq(cafeUsers.userId, userId));
}
