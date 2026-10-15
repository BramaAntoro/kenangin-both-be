import { z } from "zod";

/** Validasi field yang boleh diubah pada sebuah sesi booth. */
export const updateSessionSchema = z.object({
  frameId: z.uuid().nullable().optional(),
  printStatus: z.enum(["pending", "printed", "not printed", "failed"]).optional(),
});

/** Data perubahan sesi setelah lolos validasi. */
export type UpdateSessionDto = z.infer<typeof updateSessionSchema>;
