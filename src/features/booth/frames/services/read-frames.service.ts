import AppError from "../../../../lib/app-error.js";
import findCafeIdByUserIdRepository from "../../repositories/find-cafe-id-by-user-id.repository.js";
import readCafeIdsByUserIdRepository from "../repositories/read-cafe-ids-by-user-id.repository.js";
import readFramesRepository from "../repositories/read-frames.repository.js";

/** Bentuk data satu frame yang dikembalikan ke client. */
type ReadFrameResult = {
  id: string;
  cafeId: string | null;
  title: string;
  frameUrl: string;
  maxPhotosSlot: number;
  isActive: boolean | null;
  createdAt: Date | null;
  updatedAt: Date | null;
};

/**
 * Hasil pembacaan frame yang sudah dikelompokkan berdasarkan cakupan.
 *
 * `global` berisi frame dengan `cafeId` bernilai `null`, sedangkan `cafes`
 * berisi frame custom milik masing-masing cafe.
 */
type ReadFramesResult = {
  global: ReadFrameResult[];
  cafes: {
    cafeId: string;
    cafeName: string;
    frames: ReadFrameResult[];
  }[];
};

/**
 * Membaca dan mengelompokkan frame berdasarkan cakupan akses user.
 *
 * Super admin dapat membaca seluruh frame. Cafe admin selalu mendapatkan
 * frame global dan frame custom dari cafe yang terhubung ke akunnya.
 * Jika `cafeId` diberikan, hasil dibatasi pada cafe tersebut setelah akses
 * user terhadap cafe tersebut berhasil diverifikasi.
 *
 * @param userId - ID user yang sedang login.
 * @param role - Role user, seperti `super_admin` atau `cafe_admin`.
 * @param cafeId - ID cafe opsional untuk membatasi hasil pembacaan.
 * @returns Frame global dan frame custom yang dikelompokkan per cafe.
 * @throws AppError dengan status 404 jika user tidak terhubung ke cafe yang diminta.
 */
export default async function readFramesService(
  userId: string,
  role: string,
  cafeId?: string,
): Promise<ReadFramesResult> {
  let result;
  if (role === "super_admin") {
    result = await readFramesRepository(cafeId ? [cafeId] : undefined);
  } else if (cafeId) {
    const cafe = await findCafeIdByUserIdRepository(userId, cafeId);
    if (!cafe) {
      throw new AppError("Cafe tersebut tidak ada", 404);
    }

    result = await readFramesRepository([cafeId]);
  } else {
    const cafeIds = await readCafeIdsByUserIdRepository(userId);
    result = await readFramesRepository(cafeIds);
  }

  const groupedFrames = result.reduce<ReadFramesResult>(
    (groups, row) => {
      const { frame, cafeName } = row;

      if (frame.cafeId === null) {
        groups.global.push(frame);
      } else {
        let cafeFrames = groups.cafes.find(
          (cafe) => cafe.cafeId === frame.cafeId,
        );

        if (!cafeFrames) {
          cafeFrames = {
            cafeId: frame.cafeId,
            cafeName: cafeName!,
            frames: [],
          };
          groups.cafes.push(cafeFrames);
        }

        cafeFrames.frames.push(frame);
      }

      return groups;
    },
    { global: [], cafes: [] },
  );

  return groupedFrames;
}
