import readCafesRepository, {
  type ReadCafesParams,
  type ReadCafesResult,
} from "../repositories/read-cafes.repository.js";

/**
 * Mengambil seluruh data cafe beserta admin yang terhubung.
 *
 * @returns Daftar cafe dan data admin cafe.
 */
export default async function readCafesService(
  query: ReadCafesParams,
): Promise<ReadCafesResult> {
  return readCafesRepository(query);
}
