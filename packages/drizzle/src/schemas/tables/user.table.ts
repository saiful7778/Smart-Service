import {
  boolean,
  index,
  pgTable,
  timestamp,
  uniqueIndex,
  varchar,
} from "drizzle-orm/pg-core";
import { db_created_at, db_id, db_updated_at } from "../../utils/db-utils";
import { UserRoleEnum } from "../enums/db-enums";
import { relations } from "drizzle-orm/relations";
import { AccountTable } from "./account.table";
import { SessionTable } from "./session.table";
import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from "drizzle-zod";
import z from "zod";
import { UserActivityTable } from "./userActivity.table";
import { UserEventTable } from "./userEvent.table";

export const UserTable = pgTable(
  "users",
  {
    id: db_id,
    name: varchar("name", { length: 255 }).notNull(),
    email: varchar("email", { length: 255 }).notNull(),
    emailVerified: boolean("email_verified").notNull().default(false),
    phone: varchar("phone", { length: 20 }),
    image: varchar("image", { length: 255 }),
    role: UserRoleEnum("role").notNull().default("USER"),
    displayRole: varchar("display_role", { length: 255 }),
    banned: boolean("banned").default(false),
    banReason: varchar("ban_reason", { length: 255 }),
    banExpires: timestamp("ban_expires", { withTimezone: true, precision: 3 }),
    createdAt: db_created_at,
    updatedAt: db_updated_at,
  },
  (user) => [
    uniqueIndex("user_email_key").on(user.email),
    index("user_role_idx").on(user.role),
    index("user_created_at_idx").on(user.createdAt),
  ]
);

export const UserRelations = relations(UserTable, ({ many }) => ({
  sessions: many(SessionTable, {
    relationName: "UserToSession",
  }),
  accounts: many(AccountTable, {
    relationName: "UserToAccount",
  }),
  activities: many(UserActivityTable, { relationName: "UserToUserActivity" }),
  events: many(UserEventTable, { relationName: "UserToUserEvent" }),
}));

export const insertUserSchema = createInsertSchema(UserTable, {
  email: z.email(),
}).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export const selectUserSchema = createSelectSchema(UserTable);
export const updateUserSchema = createUpdateSchema(UserTable, {
  email: z.email().optional(),
}).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type UserDataModel = typeof UserTable.$inferSelect;
export type SelectUser = z.infer<typeof selectUserSchema>;
export type InsertUser = z.infer<typeof insertUserSchema>;
