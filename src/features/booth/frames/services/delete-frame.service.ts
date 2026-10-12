import AppError from "../../../../lib/app-error.js";
import findCafeIdByUserIdRepository from "../../repositories/find-cafe-id-by-user-id.repository.js";
import readFrameByIdRepository from "../repositories/read-frame-by-id.repository.js";
import deleteFrameRepository from "../repositories/delete-frame.repository.js";

/**
 * Menonaktifkan frame setelah memeriksa hak akses user.
 *
 * Frame global hanya dapat dinonaktifkan super admin. Cafe admin hanya dapat
 * menonaktifkan frame dari cafe yang terhubung ke akunnya.
 *
 * @param frameId - ID frame yang akan dinonaktifkan.
 * @param userId - ID user yang sedang login.
 * @param role - Role user dari JWT.
 * @returns Data frame setelah dinonaktifkan.
 * @throws {AppError} Jika frame tidak ditemukan atau user tidak memiliki akses.
 */
export default async function deleteFrameService(
  frameId: string,
  userId: string,
  role: string,
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

  const deletedFrame = await deleteFrameRepository(frameId);
  if (!deletedFrame) {
    throw new AppError("Frame tidak ditemukan", 404);
  }

  return deletedFrame;
}
