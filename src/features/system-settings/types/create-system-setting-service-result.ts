/**
 * Format hasil system setting yang berhasil dibuat.
 */
export type CreateSystemSettingServiceResult = {
  id: string;
  settingKey: string;
  settingValue: string;
  description: string | null;
  updatedBy: string | null;
  updatedAt: Date | null;
};
