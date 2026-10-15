import z from "zod";

/** Schema validasi data perubahan cafe. */
export const updateCafeSchema = z
  .object({
    name: z.string().trim().min(1).max(100).optional(),
    address: z.string().trim().min(1).max(500).optional(),
    phone: z
      .string()
      .trim()
      .min(1)
      .max(15)
      .regex(/^08\d{8,13}$/, "Nomor telepon harus diawali 08 dan berisi 10-15 digit")
      .optional(),
    cafeSharePercent: z.number().int().min(0).max(100).optional(),
    kenanginSharePercent: z.number().int().min(0).max(100).optional(),
    cafeAdminId: z.uuid("ID cafe admin tidak valid").optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "Minimal satu data harus diubah",
  })
  .refine(
    (data) => {
      const hasCafeShare = data.cafeSharePercent !== undefined;
      const hasKenanginShare = data.kenanginSharePercent !== undefined;

      return (
        hasCafeShare === hasKenanginShare &&
        (!hasCafeShare ||
          data.cafeSharePercent! + data.kenanginSharePercent! === 100)
      );
    },
    {
      message:
        "Persentase cafe dan Kenangin harus diisi bersama dan berjumlah 100",
      path: ["cafeSharePercent"],
    },
  );

/** Data perubahan cafe yang sudah divalidasi. */
export type UpdateCafeDto = z.infer<typeof updateCafeSchema>;
