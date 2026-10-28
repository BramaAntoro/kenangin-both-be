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
  accountNumber: z
    .string()
    .trim()
    .max(50, "Nomor rekening maksimal 50 karakter")
    .transform((value) => value || null)
    .optional(),
  bankName: z
    .string()
    .trim()
    .max(100, "Nama bank maksimal 100 karakter")
    .transform((value) => value || null)
    .optional(),
  password: z
    .string()
    .min(8, "Password minimal 8 karakter")
    .max(64, "Password maksimal 64 karakter"),
});

/**
 * Data akun cafe admin setelah divalidasi.
 */
export type CreateCafeAdminDto = z.infer<typeof createCafeAdminSchema>;
