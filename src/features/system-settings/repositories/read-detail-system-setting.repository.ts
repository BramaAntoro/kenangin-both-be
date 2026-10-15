import { eq } from "drizzle-orm";
import { db } from "../../../db/index.js";
import { systemSettings } from "../../../db/schema.js";
import type { SystemSettingResult } from "../types/system-setting-service-result.js";


export default async function readDetailSystemSettingRepository(id: string): Promise<SystemSettingResult | null> {
  const [result] = await db
    .select()
    .from(systemSettings)
    .where(eq(systemSettings.id, id))
    .limit(1);
  return result ?? null;
}
