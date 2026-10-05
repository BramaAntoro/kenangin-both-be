/**
 * Format hasil system setting yang berhasil dibuat.
 */
export type SystemSettingResult = {
  id: string;
  settingKey: string;
  settingValue: string;
  description: string | null;
  updatedBy: string | null;
  updatedAt: Date | null;
} | undefined;
