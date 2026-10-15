import AppError from "../../../../lib/app-error.js";
import findCafeIdByUserIdRepository from "../../repositories/find-cafe-id-by-user-id.repository.js";
import type { UpdateFrameDto } from "../dto/update-frame.dto.js";
import { getFrameUrl, removeFrameFile } from "../frame-file.js";
import readFrameByIdRepository from "../repositories/read-frame-by-id.repository.js";
import updateFrameRepository from "../repositories/update-frame.repository.js";

/**
 * Memperbarui data frame setelah memeriksa kepemilikan berdasarkan role.
 *
 * Frame global hanya dapat diperbarui super admin. Cafe admin hanya dapat
 * memperbarui frame dari cafe yang terhubung ke akunnya.
 *
 * @param frameId - ID frame yang akan diperbarui.
 * @param userId - ID user dari JWT.
 * @param role - Role user dari JWT.
 * @param payload - Data frame yang telah tervalidasi.
 * @param frameFilename - Nama file baru jika ada PNG yang diunggah.
 * @returns Data frame setelah diperbarui.
 * @throws {AppError} Jika frame tidak ditemukan atau user tidak memiliki akses.
 */
export default async function updateFrameService(
  frameId: string,
  userId: string,
  role: string,
  payload: UpdateFrameDto,
  frameFilename?: string,
) {
  const existingFrame = await readFrameByIdRepository(frameId);
  if (!existingFrame) {
    throw new AppError("Frame tidak ditemukan", 404);
  }

  if (existingFrame.cafeId === null) {
    if (role !== "super_admin") {
      throw new AppError("Hanya super admin yang dapat mengubah frame global", 403);
    }
  } else if (role !== "super_admin") {
    const cafe = await findCafeIdByUserIdRepository(userId, existingFrame.cafeId);
    if (!cafe) {
      throw new AppError("Anda tidak memiliki akses ke frame ini", 403);
    }
  }

  const updatedFrame = await updateFrameRepository(frameId, {
    ...payload,
    ...(frameFilename && { frameUrl: getFrameUrl(frameFilename) }),
  });

  if (!updatedFrame) {
    throw new AppError("Frame tidak ditemukan", 404);
  }

  if (frameFilename && existingFrame.frameUrl !== updatedFrame.frameUrl) {
    await removeFrameFile(existingFrame.frameUrl);
  }

  return updatedFrame;
}
