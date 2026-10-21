import readCafeAdminRepository, {
  type ReadCafeAdminParams,
  type ReadCafeAdminsResult,
} from "../repositories/read-cafe-admin.repository.js";

/**
 * Membaca seluruh akun cafe admin.
 */
export default async function readCafeAdminService(
  query: ReadCafeAdminParams,
): Promise<ReadCafeAdminsResult> {
  return readCafeAdminRepository(query);
}
