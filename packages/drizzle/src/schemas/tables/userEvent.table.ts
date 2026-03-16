import { relations } from "drizzle-orm";
import {
  foreignKey,
  index,
  jsonb,
  pgTable,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from "drizzle-zod";
import z from "zod";

import { db_created_at, db_id } from "../../utils/db-utils";
import { UserEventCategoryEnum } from "../enums/db-enums";
import { UserTable } from "./user.table";

export const UserEventTable = pgTable(
  "user_events",
  {
    id: db_id,
    userId: uuid("user_id").notNull(),
    actorId: uuid("actor_id"),
    category: UserEventCategoryEnum("category").notNull(),
    action: varchar("action", { length: 255 }).notNull(),
    metadata: jsonb("metadata"),
    ipAddress: varchar("ip_address", { length: 45 }),
    createdAt: db_created_at,
  },
  (userEvent) => [
    foreignKey({
      name: "user_event_user_fkey",
      columns: [userEvent.userId],
      foreignColumns: [UserTable.id],
    })
      .onDelete("cascade")
      .onUpdate("cascade"),
    index("user_event_user_id_idx").on(userEvent.userId),
    index("user_event_category_idx").on(userEvent.category),
    index("user_event_created_at_idx").on(userEvent.createdAt),
    index("user_event_user_category_idx").on(
      userEvent.userId,
      userEvent.category
    ),
  ]
);

export const UserEventRelations = relations(UserEventTable, ({ one }) => ({
  user: one(UserTable, {
    fields: [UserEventTable.userId],
    references: [UserTable.id],
    relationName: "UserToUserEvent",
  }),
}));

export const insertUserEventSchema = createInsertSchema(UserEventTable).omit({
  id: true,
  createdAt: true,
});
export const selectUserEventSchema = createSelectSchema(UserEventTable);
export const updateUserEventSchema = createUpdateSchema(UserEventTable).omit({
  id: true,
  createdAt: true,
});

export type UserEventDataModel = typeof UserEventTable.$inferSelect;
export type InsertUserEvent = z.infer<typeof insertUserEventSchema>;
export type SelectUserEvent = z.infer<typeof selectUserEventSchema>;
export type UpdateUserEvent = z.infer<typeof updateUserEventSchema>;
