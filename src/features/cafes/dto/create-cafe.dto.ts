import z from "zod";

/** Schema validasi data cafe baru beserta admin cafe yang mengelolanya. */
export const createCafeSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(1, "Nama cafe wajib diisi")
      .max(100, "Nama cafe maksimal 100 karakter"),
    address: z
      .string()
      .trim()
      .min(1, "Alamat wajib diisi")
      .max(500, "Alamat maksimal 500 karakter"),
    phone: z
      .string()
      .trim()
      .min(1, "Nomor telepon wajib diisi")
      .max(15, "Nomor telepon maksimal 15 digit")
      .regex(
        /^08\d{8,13}$/,
        "Nomor telepon harus diawali 08 dan berisi 10-15 digit",
      ),
    cafeSharePercent: z
      .number()
      .int("Persentase cafe harus berupa bilangan bulat")
      .min(0, "Persentase cafe minimal 0")
      .max(100, "Persentase cafe maksimal 100"),
    kenanginSharePercent: z
      .number()
      .int("Persentase Kenangin harus berupa bilangan bulat")
      .min(0, "Persentase Kenangin minimal 0")
      .max(100, "Persentase Kenangin maksimal 100"),
    cafeAdminId: z.uuid("ID cafe admin tidak valid"),
  })
  .refine((data) => data.cafeSharePercent + data.kenanginSharePercent === 100, {
    message: "Persentase pembagian cafe dan Kenangin harus berjumlah 100",
    path: ["cafeSharePercent"],
  });

/** Data cafe yang sudah divalidasi. */
export type CreateCafeDto = z.infer<typeof createCafeSchema>;
