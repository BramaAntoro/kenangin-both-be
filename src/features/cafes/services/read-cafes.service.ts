import readCafesRepository, {
  type ReadCafeResult,
} from "../repositories/read-cafes.repository.js";

/**
 * Mengambil seluruh data cafe beserta admin yang terhubung.
 *
 * @returns Daftar cafe dan data admin cafe.
 */
export default async function readCafesService(): Promise<ReadCafeResult[]> {
  return readCafesRepository();
}
