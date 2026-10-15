import z from "zod";

/**
 * Schema validasi untuk memperbarui system setting.
 */
export const updateSystemSettingSchema = z.object({
  settingKey: z
    .string()
    .trim()
    .min(1, "Setting key wajib diisi")
    .max(100, "Setting key maksimal 100 karakter")
    .regex(
      /^[a-z][a-z0-9_]*$/,
      "Setting key hanya boleh berisi huruf kecil, angka, dan underscore",
    ),
  settingValue: z.string().trim().min(1, "Setting value wajib diisi"),
  description: z
    .string()
    .trim()
    .max(500, "Description maksimal 500 karakter")
    .nullable(),
});

/**
 * Data system setting yang akan diperbarui.
 */
export type UpdateSystemSettingDto = z.infer<
  typeof updateSystemSettingSchema
>;
