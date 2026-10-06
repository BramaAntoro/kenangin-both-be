export type KioskStatus = "active" | "maintenance" | "offline";

/**
 * Format data kiosk yang dikembalikan ke client.
 */
export type KioskResult = {
  id: string;
  cafeId: string;
  kioskCode: string;
  name: string;
  status: KioskStatus | null;
  createdAt: Date | null;
  updatedAt: Date | null;
};
