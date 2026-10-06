import readCafeAdminRepository from "../repositories/read-cafe-admin.repository.js";
import type { ReadCafeAdminResult } from "../types/read-cafe-admin-result.js";

/**
 * Membaca seluruh akun cafe admin.
 */
export default async function readCafeAdminService(): Promise<
  ReadCafeAdminResult[]
> {
  return readCafeAdminRepository();
}
