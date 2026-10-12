import { z } from "zod";

const parseBoolean = z.preprocess(
  (val) => val === "true" || val === true,
  z.boolean(),
);

/** Schema partial untuk field frame yang dapat diperbarui lewat multipart. */
export const updateFrameSchema = z.object({
  title: z.string().trim().min(1, "title tidak boleh kosong"),
  maxPhotosSlot: z.coerce
    .number()
    .int()
    .positive("max_photos_slot harus berupa integer positif"),
  is_active: parseBoolean,
});

/** Field frame yang telah lolos validasi untuk operasi pembaruan. */
export type UpdateFrameDto = z.infer<typeof updateFrameSchema>;
