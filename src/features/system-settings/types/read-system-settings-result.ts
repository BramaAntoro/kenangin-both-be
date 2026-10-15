/**
 * Format system setting yang ditampilkan pada endpoint read.
 */
export type ReadSystemSettingResult = {
  id: string;
  settingKey: string;
  settingValue: string;
};
