import {
  pgTable,
  text,
  timestamp,
  boolean,
  uuid,
  varchar,
  numeric,
  date,
  pgEnum,
  uniqueIndex,
  index,
} from "drizzle-orm/pg-core";

// ─── Better Auth Tables ─────────────────────────────────────────────────────

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").notNull().default(false),
  image: text("image"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  role: text("role"),
  banned: boolean("banned"),
  banReason: text("ban_reason"),
  banExpires: timestamp("ban_expires"),
});

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  impersonatedBy: text("impersonated_by"),
});

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// ─── Custom Enums ───────────────────────────────────────────────────────────

export const transactionTypeEnum = pgEnum("transaction_type", [
  "income",
  "expense",
]);

export const transactionStatusEnum = pgEnum("transaction_status", [
  "completed",
  "pending",
  "syncing",
]);

export const budgetPeriodEnum = pgEnum("budget_period", [
  "weekly",
  "monthly",
]);

export const categoryTypeEnum = pgEnum("category_type", [
  "income",
  "expense",
  "both",
]);

// ─── Custom Tables ──────────────────────────────────────────────────────────

export const userPreferences = pgTable("user_preferences", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id")
    .notNull()
    .unique()
    .references(() => user.id, { onDelete: "cascade" }),
  displayName: varchar("display_name", { length: 100 }),
  defaultCurrency: varchar("default_currency", { length: 10 })
    .notNull()
    .default("IDR"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const categories = pgTable("categories", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id").references(() => user.id, { onDelete: "cascade" }),
  name: varchar("name", { length: 50 }).notNull(),
  icon: varchar("icon", { length: 50 }).notNull(),
  description: varchar("description", { length: 100 }),
  color: varchar("color", { length: 20 }),
  type: categoryTypeEnum("type").notNull().default("expense"),
  isDefault: boolean("is_default").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const transactions = pgTable(
  "transactions",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    categoryId: uuid("category_id")
      .notNull()
      .references(() => categories.id),
    type: transactionTypeEnum("type").notNull(),
    amount: numeric("amount", { precision: 12, scale: 2 }).notNull(),
    description: varchar("description", { length: 255 }).notNull(),
    notes: text("notes"),
    date: date("date").notNull(),
    status: transactionStatusEnum("status").notNull().default("completed"),
    paymentMethod: varchar("payment_method", { length: 50 }),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => [
    index("idx_transactions_user_date").on(table.userId, table.date),
    index("idx_transactions_user_category").on(table.userId, table.categoryId),
    index("idx_transactions_user_type").on(table.userId, table.type),
  ]
);

export const budgets = pgTable(
  "budgets",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    categoryId: uuid("category_id")
      .notNull()
      .references(() => categories.id),
    amount: numeric("amount", { precision: 12, scale: 2 }).notNull(),
    period: budgetPeriodEnum("period").notNull().default("monthly"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex("idx_budgets_user_category_period").on(
      table.userId,
      table.categoryId,
      table.period
    ),
  ]
);
