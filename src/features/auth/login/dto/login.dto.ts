import z from "zod";

/**
 * Skema validasi Zod untuk data login user.
 * Email akan di-trim dan diubah menjadi huruf kecil, sedangkan password
 * harus memiliki panjang antara 8 hingga 64 karakter.
 */
export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Email wajib diisi")
    .max(100, "Email maksimal 100 karakter")
    .email("Format email tidak valid, contoh: example@gmail.com"),
  password: z
    .string()
    .min(8, "Password minimal 8 karakter")
    .max(64, "Password maksimal 64 karakter"),
});

/**
 * Data Transfer Object untuk login user.
 * Berisi data login yang telah sesuai dengan `loginSchema`.
 */
export type LoginDto = z.infer<typeof loginSchema>;
