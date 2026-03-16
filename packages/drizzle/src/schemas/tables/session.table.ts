import {
  foreignKey,
  index,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm/relations";
import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from "drizzle-zod";
import z from "zod";

import { db_created_at, db_id, db_updated_at } from "../../utils/db-utils";
import { UserTable } from "./user.table";

export const SessionTable = pgTable(
  "sessions",
  {
    id: db_id,
    token: text("token").notNull(),
    ipAddress: varchar("ip_address", { length: 45 }), // IPv6 compatible
    userAgent: text("user_agent"),
    impersonatedBy: varchar("impersonated_by", { length: 255 }),
    userId: uuid("user_id").notNull(),
    expiresAt: timestamp("expires_at", {
      withTimezone: true,
      precision: 6,
    }).notNull(),
    createdAt: db_created_at,
    updatedAt: db_updated_at,
  },
  (session) => [
    foreignKey({
      name: "sessions_user_fkey",
      columns: [session.userId],
      foreignColumns: [UserTable.id],
    })
      .onDelete("cascade")
      .onUpdate("cascade"),
    uniqueIndex("session_token_key").on(session.token),
    index("session_user_id_idx").on(session.userId),
    index("session_expires_at_idx").on(session.expiresAt),
  ]
);

export const SessionRelations = relations(SessionTable, ({ one }) => ({
  user: one(UserTable, {
    relationName: "UserToSession",
    fields: [SessionTable.userId],
    references: [UserTable.id],
  }),
}));

export const insertSessionSchema = createInsertSchema(SessionTable).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export const selectSessionSchema = createSelectSchema(SessionTable);
export const updateSessionSchema = createUpdateSchema(SessionTable);

export type SessionDataModel = typeof SessionTable.$inferSelect;
export type SelectSession = z.infer<typeof selectSessionSchema>;
export type InsertSession = z.infer<typeof insertSessionSchema>;
