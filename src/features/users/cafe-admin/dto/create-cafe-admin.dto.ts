import z from "zod";

/**
 * Schema validasi data akun cafe admin yang dibuat oleh super admin.
 */
export const createCafeAdminSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .min(1, "Email wajib diisi")
    .max(100, "Email maksimal 100 karakter")
    .email("Format email tidak valid, contoh: example@gmail.com"),
  name: z
    .string()
    .trim()
    .min(1, "Nama wajib diisi")
    .max(50, "Nama maksimal 50 karakter"),
  password: z
    .string()
    .min(8, "Password minimal 8 karakter")
    .max(64, "Password maksimal 64 karakter"),
});

/**
 * Data akun cafe admin setelah divalidasi.
 */
export type CreateCafeAdminDto = z.infer<typeof createCafeAdminSchema>;
