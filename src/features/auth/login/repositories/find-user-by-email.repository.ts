import { eq } from "drizzle-orm";
import { db } from "../../../../db/index.js";
import { users } from "../../../../db/schema.js";
import type { UserResult } from "../../../../types/users/user-result.js";

type FindUserByEmailResult = UserResult & {
  password: string;
};

/**
 * Mencari user berdasarkan email untuk kebutuhan login.
 */
export default async function findUserByEmailRepository(
  email: string,
): Promise<FindUserByEmailResult | null> {
  const [result] = await db
    .select({
      id: users.id,
      email: users.email,
      name: users.name,
      password: users.password,
      role: users.role,
    })
    .from(users)
    .where(eq(users.email, email));

  return result || null;
}
