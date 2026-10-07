import z from "zod";

/**
 * Schema validasi untuk fitur JSONB pada paket booth.
 */
export const packageFeaturesSchema = z.object({
  timer_duration: z
    .number({ message: "timer_duration harus berupa angka" })
    .int("timer_duration harus bilangan bulat")
    .min(0, "timer_duration tidak boleh negatif")
    .optional(),
  retake_limit: z
    .number({ message: "retake_limit harus berupa angka" })
    .int("retake_limit harus bilangan bulat")
    .min(0, "retake_limit tidak boleh negatif")
    .optional(),
  allow_filters: z
    .boolean({ message: "allow_filters harus berupa boolean" })
    .optional(),
  allow_emoji: z
    .boolean({ message: "allow_emoji harus berupa boolean" })
    .optional(),
  allow_custom_text: z
    .boolean({ message: "allow_custom_text harus berupa boolean" })
    .optional(),
});

/**
 * Schema validasi untuk membuat paket booth baru.
 * `cafe_id` diambil dari JWT token, .
 */
export const createBoothPackageSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Nama paket wajib diisi")
    .max(100, "Nama paket maksimal 100 karakter"),
  price: z
    .number({ message: "Harga harus berupa angka" })
    .int("Harga harus bilangan bulat")
    .min(0, "Harga tidak boleh negatif"),
  photoShotsCount: z
    .number({ message: "Jumlah foto harus berupa angka" })
    .int("Jumlah foto harus bilangan bulat")
    .min(1, "Jumlah foto minimal 1"),
  printCopiesCount: z
    .number({ message: "Jumlah cetak harus berupa angka" })
    .int("Jumlah cetak harus bilangan bulat")
    .min(1, "Jumlah cetak minimal 1"),
  features: packageFeaturesSchema,
  description: z
    .string()
    .trim()
    .max(500, "Deskripsi maksimal 500 karakter")
    .optional(),
});

/**
 * Data paket booth yang sudah divalidasi.
 */
export type CreateBoothPackageDto = z.infer<typeof createBoothPackageSchema>;

