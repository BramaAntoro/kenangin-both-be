import { eq } from "drizzle-orm";
import { db } from "../../../db/index.js";
import { systemSettings } from "../../../db/schema.js";

/**
 * Mencari system setting berdasarkan key.
 *
 * @param settingKey - Key setting yang dicari.
 * @returns ID system setting atau `undefined` jika belum ada.
 */
export default async function findSystemSettingRepository(
  settingKey: string,
): Promise<{ id: string } | undefined> {
  const [result] = await db
    .select({ id: systemSettings.id })
    .from(systemSettings)
    .where(eq(systemSettings.settingKey, settingKey));

  return result;
}
