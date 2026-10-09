import { z } from "zod";

/**
 * Schema body untuk membuat frame.
 *
 * `maxPhotosSlot` memakai coercion karena multipart/form-data mengirim nilai
 * text sebagai string. `cafeId` hanya diperlukan untuk cafe admin; Super
 * Admin membuat frame global dan service akan menyimpannya sebagai `null`.
 */
export const createFrameSchema = z.object({
  title: z.string().trim().min(1, "title wajib diisi"),
  maxPhotosSlot: z.coerce
    .number()
    .int()
    .positive("max_photos_slot harus berupa integer positif"),
  cafeId: z.string().trim().min(1).nullable().optional(),
});

/** Data body yang sudah tervalidasi untuk membuat frame. */
export type CreateFrameDto = z.infer<typeof createFrameSchema>;
