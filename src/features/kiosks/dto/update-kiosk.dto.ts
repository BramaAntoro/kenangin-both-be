import z from "zod";
import { kioskStatusEnum } from "../../../db/schema.js";

/**
 * Schema validasi untuk memperbarui data kiosk.
 */
export const updateKioskSchema = z
  .object({
    cafeId: z.uuid("ID cafe tidak valid").optional(),
    name: z
      .string()
      .trim()
      .min(1, "Nama kiosk tidak boleh kosong")
      .max(100, "Nama kiosk maksimal 100 karakter")
      .optional(),
    status: z
      .enum(kioskStatusEnum.enumValues, {
        message:
          "Status kiosk harus salah satu dari: " +
          kioskStatusEnum.enumValues.join(", "),
      })
      .optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "Minimal satu data harus diubah",
  });

/**
 * Data perubahan kiosk yang sudah divalidasi.
 */
export type UpdateKioskDto = z.infer<typeof updateKioskSchema>;
