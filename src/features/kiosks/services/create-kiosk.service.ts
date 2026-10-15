import AppError from "../../../lib/app-error.js";
import type { CreateKioskDto } from "../dto/create-kiosk.dto.js";
import countKiosksByCafeIdRepository from "../repositories/count-kiosks-by-cafe-id.repository.js";
import createKioskRepository from "../repositories/create-kiosk.repository.js";
import existsKioskCodeRepository from "../repositories/exists-kiosk-code.repository.js";
import findCafeByIdRepository from "../repositories/find-cafe-by-id.repository.js";
import type { KioskResult } from "../types/kiosk-result.js";
import generateKioskCode from "../utils/generate-kiosk-code.js";

/**
 * Membuat kiosk baru untuk cafe tertentu dengan kode kiosk otomatis.
 *
 * @param payload - Data kiosk yang sudah divalidasi.
 * @returns Data kiosk yang berhasil dibuat.
 * @throws {AppError} Jika cafe tidak ditemukan.
 */
export default async function createKioskService(
  payload: CreateKioskDto,
): Promise<KioskResult> {
  const { cafeId, name, status } = payload;

  const cafe = await findCafeByIdRepository(cafeId);
  if (!cafe) {
    throw new AppError("Cafe tidak ditemukan", 404);
  }

  const kioskCount = await countKiosksByCafeIdRepository(cafeId);

  let sequence = kioskCount + 1;
  let kioskCode = generateKioskCode(cafe.name, sequence);

  while (await existsKioskCodeRepository(kioskCode)) {
    sequence++;
    kioskCode = generateKioskCode(cafe.name, sequence);
  }

  const result = await createKioskRepository({
    cafeId,
    kioskCode,
    name,
    status,
  });

  if (!result) {
    throw new AppError("Gagal membuat kiosk", 500);
  }

  return result;
}

