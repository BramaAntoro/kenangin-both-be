import { relations } from "drizzle-orm";
import {
  boolean,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

// ==========================================
// 1. ENUMS
// ==========================================

export const userRoleEnum = pgEnum("user_role", ["super_admin", "cafe_admin"]);

export const paymentStatusEnum = pgEnum("payment_status", [
  "pending",
  "settlement",
  "expire",
  "cancel",
  "deny",
]);

export const kioskStatusEnum = pgEnum("kiosk_status", [
  "active",
  "maintenance",
  "offline",
]);

export const printStatusEnum = pgEnum("print_status", [
  "pending",
  "printed",
  "failed",
]);

export const maintenanceTypeEnum = pgEnum("maintenance_type", [
  "routine",
  "repair",
  "paper_refill",
  "software_update",
  "other",
]);

// Interface TypeScript untuk struktur JSONB pada booth_packages.features
export interface PackageFeatures {
  allow_frame?: boolean;
  allow_emoji?: boolean;
  allow_filters?: boolean;
  allow_custom_text?: boolean;
  retake_limit?: number;
  timer_duration?: number;
  [key: string]: unknown;
}

// ==========================================
// 2. TABLES
// ==========================================

// Tabel Profil Pengguna
export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: varchar("email").notNull().unique(),
  passwordHash: varchar("password_hash"),
  fullName: varchar("full_name").notNull(),
  role: userRoleEnum("role").notNull().default("cafe_admin"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

// Master Konfigurasi Global Sistem
export const systemSettings = pgTable("system_settings", {
  id: uuid("id").defaultRandom().primaryKey(),
  settingKey: varchar("setting_key").notNull().unique(),
  settingValue: text("setting_value").notNull(),
  description: text("description"),
  updatedBy: uuid("updated_by").references(() => users.id),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

// Master Data Kafe Mitra B2B
export const cafes = pgTable("cafes", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name").notNull(),
  slug: varchar("slug").notNull().unique(),
  address: text("address"),
  phone: varchar("phone"),
  cafeSharePercent: integer("cafe_share_percent").notNull().default(40),
  kenanginSharePercent: integer("kenangin_share_percent").notNull().default(60),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

// Relasi Admin Kafe dengan Kafe yang Dikelola
export const cafeUsers = pgTable("cafe_users", {
  id: uuid("id").defaultRandom().primaryKey(),
  cafeId: uuid("cafe_id")
    .notNull()
    .references(() => cafes.id),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

// Unit Hardware Kiosk Fisik
export const kiosks = pgTable("kiosks", {
  id: uuid("id").defaultRandom().primaryKey(),
  cafeId: uuid("cafe_id")
    .notNull()
    .references(() => cafes.id),
  kioskCode: varchar("kiosk_code").notNull().unique(),
  name: varchar("name").notNull(),
  status: kioskStatusEnum("status").default("active"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

// Master Paket Sesi Foto (Kustomisasi JSONB)
export const boothPackages = pgTable("booth_packages", {
  id: uuid("id").defaultRandom().primaryKey(),
  cafeId: uuid("cafe_id")
    .notNull()
    .references(() => cafes.id),
  name: varchar("name").notNull(),
  price: integer("price").notNull(),
  photoShotsCount: integer("photo_shots_count").notNull().default(4),
  printCopiesCount: integer("print_copies_count").notNull().default(1),
  features: jsonb("features").$type().notNull(),
  description: text("description"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

// Master Desain Frame (Global Kenangin atau Custom Kafe)
export const frames = pgTable("frames", {
  id: uuid("id").defaultRandom().primaryKey(),
  cafeId: uuid("cafe_id").references(() => cafes.id), // NULL jika frame global Super Admin
  title: varchar("title").notNull(),
  frameUrl: text("frame_url").notNull(),
  maxPhotosSlot: integer("max_photos_slot").notNull().default(3),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

// Pencatatan Transaksi Pembayaran QRIS & Breakdown Finansial
export const boothTransactions = pgTable("booth_transactions", {
  id: uuid("id").defaultRandom().primaryKey(),
  kioskId: uuid("kiosk_id")
    .notNull()
    .references(() => kiosks.id),
  cafeId: uuid("cafe_id")
    .notNull()
    .references(() => cafes.id),
  packageId: uuid("package_id")
    .notNull()
    .references(() => boothPackages.id),
  orderId: varchar("order_id").notNull().unique(),

  grossAmount: integer("gross_amount").notNull(),
  cafeShareAmount: integer("cafe_share_amount").notNull(),
  kenanginShareAmount: integer("kenangin_share_amount").notNull(),

  operasionalAmount: integer("operasional_amount").notNull(),
  maintenanceAmount: integer("maintenance_amount").notNull(),
  rndAmount: integer("rnd_amount").notNull(),
  profitAmount: integer("profit_amount").notNull(),

  paymentStatus: paymentStatusEnum("payment_status").default("pending"),
  paymentType: varchar("payment_type"),
  snapToken: varchar("snap_token"),
  paidAt: timestamp("paid_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

// Operational Sesi Foto, Status Cetak & Log Drive
export const sessions = pgTable("sessions", {
  id: uuid("id").defaultRandom().primaryKey(),
  transactionId: uuid("transaction_id")
    .notNull()
    .unique()
    .references(() => boothTransactions.id),
  frameId: uuid("frame_id")
    .notNull()
    .references(() => frames.id),
  sessionCode: varchar("session_code").notNull().unique(),
  printStatus: printStatusEnum("print_status").default("pending"),

  guestEmail: varchar("guest_email"),
  finalDriveUrl: text("final_drive_url"),
  emailSentAt: timestamp("email_sent_at", { withTimezone: true }),

  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

// Utama Riwayat Log Pemeliharaan Hardware Kiosk
export const maintenanceLogs = pgTable("maintenance_logs", {
  id: uuid("id").defaultRandom().primaryKey(),
  kioskId: uuid("kiosk_id")
    .notNull()
    .references(() => kiosks.id),
  performedBy: uuid("performed_by").references(() => users.id),
  type: maintenanceTypeEnum("type").notNull().default("routine"),
  title: varchar("title").notNull(),
  description: text("description"),
  photoUrl: text("photo_url"),
  performedAt: timestamp("performed_at", { withTimezone: true }).defaultNow(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

// Rincian Item Biaya Pemeliharaan
export const maintenanceCostItems = pgTable("maintenance_cost_items", {
  id: uuid("id").defaultRandom().primaryKey(),
  maintenanceLogId: uuid("maintenance_log_id")
    .notNull()
    .references(() => maintenanceLogs.id),
  itemName: varchar("item_name").notNull(),
  amount: integer("amount").notNull().default(0),
  description: text("description"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

// ==========================================
// 3. DRIZZLE RELATIONS
// ==========================================

export const usersRelations = relations(users, ({ many }) => ({
  systemSettings: many(systemSettings),
  cafeUsers: many(cafeUsers),
  maintenanceLogs: many(maintenanceLogs),
}));

export const systemSettingsRelations = relations(systemSettings, ({ one }) => ({
  updatedByUser: one(users, {
    fields: [systemSettings.updatedBy],
    references: [users.id],
  }),
}));

export const cafesRelations = relations(cafes, ({ many }) => ({
  cafeUsers: many(cafeUsers),
  kiosks: many(kiosks),
  boothPackages: many(boothPackages),
  frames: many(frames),
  boothTransactions: many(boothTransactions),
}));

export const cafeUsersRelations = relations(cafeUsers, ({ one }) => ({
  cafe: one(cafes, {
    fields: [cafeUsers.cafeId],
    references: [cafes.id],
  }),
  user: one(users, {
    fields: [cafeUsers.userId],
    references: [users.id],
  }),
}));

export const kiosksRelations = relations(kiosks, ({ one, many }) => ({
  cafe: one(cafes, {
    fields: [kiosks.cafeId],
    references: [cafes.id],
  }),
  boothTransactions: many(boothTransactions),
  maintenanceLogs: many(maintenanceLogs),
}));

export const boothPackagesRelations = relations(
  boothPackages,
  ({ one, many }) => ({
    cafe: one(cafes, {
      fields: [boothPackages.cafeId],
      references: [cafes.id],
    }),
    boothTransactions: many(boothTransactions),
  }),
);

export const framesRelations = relations(frames, ({ one, many }) => ({
  cafe: one(cafes, {
    fields: [frames.cafeId],
    references: [cafes.id],
  }),
  sessions: many(sessions),
}));

export const boothTransactionsRelations = relations(
  boothTransactions,
  ({ one }) => ({
    kiosk: one(kiosks, {
      fields: [boothTransactions.kioskId],
      references: [kiosks.id],
    }),
    cafe: one(cafes, {
      fields: [boothTransactions.cafeId],
      references: [cafes.id],
    }),
    package: one(boothPackages, {
      fields: [boothTransactions.packageId],
      references: [boothPackages.id],
    }),
    session: one(sessions),
  }),
);

export const sessionsRelations = relations(sessions, ({ one }) => ({
  transaction: one(boothTransactions, {
    fields: [sessions.transactionId],
    references: [boothTransactions.id],
  }),
  frame: one(frames, {
    fields: [sessions.frameId],
    references: [frames.id],
  }),
}));

export const maintenanceLogsRelations = relations(
  maintenanceLogs,
  ({ one, many }) => ({
    kiosk: one(kiosks, {
      fields: [maintenanceLogs.kioskId],
      references: [kiosks.id],
    }),
    performedByUser: one(users, {
      fields: [maintenanceLogs.performedBy],
      references: [users.id],
    }),
    costItems: many(maintenanceCostItems),
  }),
);

export const maintenanceCostItemsRelations = relations(
  maintenanceCostItems,
  ({ one }) => ({
    maintenanceLog: one(maintenanceLogs, {
      fields: [maintenanceCostItems.maintenanceLogId],
      references: [maintenanceLogs.id],
    }),
  }),
);
