import type { KioskResult } from "./kiosk-result.js";

/**
 * Format hasil pengelompokan kiosk berdasarkan nama cafe.
 * Format: { [namaCafe]: KioskResult[] }
 */
export type ReadKiosksResult = Record<string, KioskResult[]>;
