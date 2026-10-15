import z from "zod";

/** Schema validasi body untuk inisiasi transaksi booth. */
export const transactionInitiateSchema = z.object({
  packageId: z
    .string("Package ID wajib diisi")
    .uuid("Format Package ID harus berupa UUID valid"),
  kioskId: z
    .string("Kiosk ID wajib diisi")
    .uuid("Format Kiosk ID harus berupa UUID valid"),
});

/** Data body transaksi yang sudah lolos validasi. */
export type transactionInitiateDto = z.infer<typeof transactionInitiateSchema>;
