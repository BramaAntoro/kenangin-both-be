import z from "zod";

/**
 * Schema validasi untuk membuat system setting baru.
 */
export const createSystemSettingSchema = z.object({
  settingKey: z
    .string()
    .trim()
    .min(1, "Setting key wajib diisi")
    .max(100, "Setting key maksimal 100 karakter")
    .regex(
      /^[a-z][a-z0-9_]*$/,
      "Setting key hanya boleh berisi huruf kecil, angka, dan underscore",
    ),
  settingValue: z
    .string()
    .trim()
    .min(1, "Setting value wajib diisi"),
  description: z
    .string()
    .trim()
    .max(500, "Description maksimal 500 karakter")
    .optional(),
});

/**
 * Data system setting yang sudah divalidasi.
 */
export type CreateSystemSettingDto = z.infer<
  typeof createSystemSettingSchema
>;
