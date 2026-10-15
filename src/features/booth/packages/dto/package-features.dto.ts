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