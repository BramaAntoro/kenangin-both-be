import AppError from "../../../../lib/app-error.js";
import findCafeIdByUserIdRepository from "../../repositories/find-cafe-id-by-user-id.repository.js";
import createFrameRepository from "../repositories/create-frame.repository.js";
import type { CreateFrameDto } from "../dto/create-frame.dto.js";
import { getFrameUrl } from "../frame-file.js";

/**
 * Membuat frame global atau frame milik cafe.
 *
 * Super Admin selalu membuat frame global dengan `cafeId` bernilai `null`.
 * Cafe admin wajib memilih cafe yang terhubung dengan akun pada JWT.
 *
 * @param payload - Data frame yang telah tervalidasi dari request body.
 * @param userId - ID user dari JWT.
 * @param role - Role user dari JWT.
 * @param frameFilename - Nama file PNG yang disimpan oleh Multer.
 * @returns Frame yang berhasil dibuat.
 * @throws {AppError} Jika cafe belum dipilih atau bukan milik cafe admin.
 */
export default async function createFrameService(
  payload: CreateFrameDto,
  userId: string,
  role: string,
  frameFilename: string,
) {
  const { title, maxPhotosSlot, cafeId } = payload;
  const frameUrl = getFrameUrl(frameFilename);

  let frameCafeId: string | null;
  if (role === "super_admin") {
    frameCafeId = null;
  } else {
    if (!cafeId) throw new AppError("cafe_id wajib diisi", 400);

    const cafe = await findCafeIdByUserIdRepository(userId, cafeId);
    if (!cafe) throw new AppError("Cafe tersebut tidak ada", 403);

    frameCafeId = cafe.cafeId;
  }

  const result = await createFrameRepository({
    title,
    frameUrl,
    maxPhotosSlot,
    cafeId: frameCafeId,
  });

  return result;
}
