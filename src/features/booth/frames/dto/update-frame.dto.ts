import { z } from "zod";

const parseBoolean = z.preprocess(
  (val) => val === "true" || val === true,
  z.boolean(),
);

/**
 * Schema body multipart untuk pembaruan frame.
 *
 * Nilai `is_active` dapat diterima sebagai boolean atau string boolean.
 */
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
