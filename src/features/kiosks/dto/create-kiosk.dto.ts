import z from "zod";
import { kioskStatusEnum } from "../../../db/schema.js";

/**
 * Schema validasi untuk membuat kiosk baru.
 * `kioskCode` di-generate secara otomatis oleh sistem.
 */
export const createKioskSchema = z.object({
  cafeId: z.uuid("ID cafe tidak valid"),
  name: z
    .string()
    .trim()
    .min(1, "Nama kiosk wajib diisi")
    .max(100, "Nama kiosk maksimal 100 karakter"),
  status: z
    .enum(kioskStatusEnum.enumValues, {
      message:
        "Status kiosk harus salah satu dari: " +
        kioskStatusEnum.enumValues.join(", "),
    })
    .optional(),
});

/**
 * Data kiosk yang sudah divalidasi.
 */
export type CreateKioskDto = z.infer<typeof createKioskSchema>;

